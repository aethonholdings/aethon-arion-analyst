import { Subject, of, throwError } from "rxjs";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { OptimiserStateViewContainerComponent } from "./optimiser-state/view/optimiser-state-view-container.component";
import { OrgConfigIndexContainerComponent } from "./org-config/index/org-config-index-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { OptimiserStateViewComponent } from "../components/core/optimiser-state/view/optimiser-state-view.component";
import { C1 } from "aethon-arion-c1";
import { ExperimentCreateContainerComponent } from "./experiment/experiment-create-container.component";
import { ControlExperimentResultComponent } from "./experiment/control-experiment-result.component";
import { MonitorContainerComponent, MONITOR_REFRESH_MS } from "./monitor/monitor-container.component";
import { discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { c1GradientAscentDefaultOptimiserParams } from "../components/models/c1/constants/analyst-c1.constants";

const route = (id = "5") => ({ snapshot: { paramMap: { get: () => id }, queryParamMap: { get: () => null } } }) as any;
const spinner = () => jasmine.createSpyObj("SpinnerService", ["show", "hide"]);
const router = () => jasmine.createSpyObj("Router", ["navigate"]);

describe("SimSetViewContainerComponent refresh", () => {
    it("shares one request per refresh between subscribers, re-fetches on manual refresh, and survives errors", () => {
        const timer = new Subject<number>();
        let calls = 0, fail = false;
        const service: any = {
            getRefeshTimer$: () => timer,
            getSimSet$: () => { calls++; return fail ? throwError(() => new Error("404")) : of({ id: 5, optimiserStates: [] }); }
        };
        const sp = spinner();
        const c = new SimSetViewContainerComponent(route(), router(), service, sp);
        c.ngOnInit();
        const seen: any[] = [], steps: any[] = [];
        c.simSetRefresh$.subscribe((s) => seen.push(s));
        c.stepsData$.subscribe((s) => steps.push(s));
        timer.next(0);
        expect(calls).toBe(1); // two template subscriptions, one request
        expect(seen.length).toBe(1);
        expect(steps).toEqual([[]]);
        c.manualRefresh();
        expect(calls).toBe(2);
        fail = true;
        timer.next(1);
        expect(calls).toBe(3);
        fail = false;
        timer.next(2); // the stream is still alive after the error
        expect(calls).toBe(4);
        expect(seen.length).toBe(3);
        expect(sp.show).toHaveBeenCalledTimes(4);
        expect(sp.hide).toHaveBeenCalledTimes(4); // hidden after the failed request too
        c.ngOnDestroy();
    });
});

describe("OptimiserStateViewContainerComponent refresh", () => {
    it("shares the state between the view and the breadcrumbs and re-fetches on manual refresh", () => {
        const timer = new Subject<number>();
        let calls = 0;
        const service: any = { getRefeshTimer$: () => timer, getOptimiserState$: () => { calls++; return of({ id: 9, simSet: { id: 2 } }); } };
        const c = new OptimiserStateViewContainerComponent(route("9"), service, spinner(), router());
        c.ngOnInit();
        const crumbs: any[] = [];
        c.optimiserState$.subscribe();
        c.breadcrumbs$.subscribe((b) => crumbs.push(b));
        timer.next(0);
        expect(calls).toBe(1);
        expect(crumbs[0][1].label).toBe("SimSet 2");
        c.manualRefresh();
        expect(calls).toBe(2);
        c.ngOnDestroy();
    });
});

describe("OrgConfigIndexContainerComponent", () => {
    it("shows the rows of the latest selection even when an older response arrives last", () => {
        const timer = new Subject<number>();
        const responses: { [n: number]: Subject<any[]> } = { 13: new Subject(), 5: new Subject() };
        const service: any = {
            getRefeshTimer$: () => timer,
            getRunningOrgConfigs$: () => of([]),
            getOrgConfigSummary$: () => of([]),
            getOrgConfigsByAgentCount$: (n: number) => responses[n]
        };
        const sp = spinner();
        const c = new OrgConfigIndexContainerComponent(service, router(), route(), sp);
        c.ngOnInit();
        const tables: any[][] = [];
        c.tableRows$.subscribe((rows) => tables.push(rows));
        timer.next(0);
        c.selectAgentCount(13);
        c.selectAgentCount(5);
        responses[5].next([{ id: 50, simConfigs: [] }]);
        responses[13].next([{ id: 130, simConfigs: [] }]); // stale: must be ignored
        expect(tables[tables.length - 1].map((r) => r.orgConfigId)).toEqual([50]);
        expect(sp.hide).toHaveBeenCalled();
    });
});

describe("SimSetCreateContainerComponent", () => {
    const make = () => {
        const service: any = jasmine.createSpyObj("AnalystService", ["createSimSet$", "getSimSet$"]);
        service.createSimSet$.and.returnValue(of({ id: 12 }));
        const r = router();
        const models: any = { getModels: () => [C1] };
        const c = new SimSetCreateContainerComponent(service, r, route() as any, models);
        return { c, service, r };
    };
    it("blocks submission and shows the validation errors for an invalid parameter space", () => {
        const { c, service } = make();
        const params = c1GradientAscentDefaultOptimiserParams();
        (params.parameterSpace[0].domain as any).min = 10; // spans min above max
        c.simSet = { modelName: "C1", optimiserParams: params } as any;
        c.createSimSet();
        expect(service.createSimSet$).not.toHaveBeenCalled();
        expect(c.errors.length).toBeGreaterThan(0);
    });
    it("submits a valid SimSet and navigates to it", () => {
        const { c, service, r } = make();
        c.simSet = { modelName: "C1", optimiserParams: c1GradientAscentDefaultOptimiserParams() } as any;
        c.createSimSet();
        expect(service.createSimSet$).toHaveBeenCalled();
        expect(r.navigate).toHaveBeenCalledWith(["/sim-set", 12]);
    });
    it("shows the server's error message when creation fails", () => {
        const { c, service } = make();
        service.createSimSet$.and.returnValue(throwError(() => ({ error: { error: { message: "Invalid optimiser parameters: x" } } })));
        c.simSet = { modelName: "C1", optimiserParams: c1GradientAscentDefaultOptimiserParams() } as any;
        c.createSimSet();
        expect(c.errors).toEqual(["Invalid optimiser parameters: x"]);
    });
});

describe("OptimiserStateViewComponent", () => {
    const state = (avg: number) =>
        ({ convergenceTests: [{ configuratorParams: { hash: "abcdef123" }, simConfigs: [{ id: 1, orgConfigId: 7, avgPerformance: avg, state: "completed" }] }] }) as any;
    it("rebuilds its rows when the optimiser state input changes", () => {
        const c = new OptimiserStateViewComponent(router());
        c.optimiserState = state(10);
        c.ngOnChanges();
        expect(c.orgConfigRows[0].simConfigs[0].avgPerformance).toBe(10);
        c.optimiserState = state(20);
        c.ngOnChanges();
        expect(c.orgConfigRows.length).toBe(1);
        expect(c.orgConfigRows[0].simConfigs[0].avgPerformance).toBe(20);
        expect(c.orgConfigRows[0].configHash).toBe("abcdef12");
    });
});

describe("MonitorContainerComponent", () => {
    const progress = (results: number): any => ({
        generatedAt: "2026-01-01T00:10:00.000Z",
        activity: { windowMinutes: 5, dispatchedRuns: 10, results, failedRuns: 0, resultsPerMinute: results / 5, resultsLastHour: 99, inFlightRuns: 4, activeInstances: 4 },
        nodes: [],
        simSets: []
    });

    it("refreshes every 10 s and on demand, and keeps going after a failed request", fakeAsync(() => {
        let calls = 0, fail = false;
        const service: any = { getProgress$: () => { calls++; return fail ? throwError(() => new Error("down")) : of(progress(calls)); } };
        const c = new MonitorContainerComponent(service);
        c.ngOnInit();
        const seen: any[] = [];
        const sub = c.progress$.subscribe((p) => seen.push(p));
        tick(0);
        expect(calls).toBe(1); // first load straight away
        fail = true;
        c.refresh();
        expect(c.error).toBe("down");
        fail = false;
        c.refresh();
        expect(c.error).toBeNull();
        expect(seen.map((p) => p.activity.results)).toEqual([1, 3]);
        tick(MONITOR_REFRESH_MS);
        expect(calls).toBe(4);
        sub.unsubscribe();
        c.ngOnDestroy();
        discardPeriodicTasks();
    }));

    it("formats convergence, ages and machine ids", () => {
        const c = new MonitorContainerComponent({} as any);
        expect(c.convergedPercent({ simConfigs: 30, convergedSimConfigs: 13 } as any)).toBe(43);
        expect(c.convergedPercent({ simConfigs: 0, convergedSimConfigs: 0 } as any)).toBe(0);
        const now = "2026-01-01T12:00:00.000Z";
        expect(c.ago(null, now)).toBe("never");
        expect(c.ago("2026-01-01T11:59:48.000Z", now)).toBe("12 s ago");
        expect(c.ago("2026-01-01T11:56:00.000Z", now)).toBe("4 min ago");
        expect(c.ago("2026-01-01T09:00:00.000Z", now)).toBe("3 h ago");
        expect(c.shortId("aws-fleet")).toBe("aws-fleet");
        expect(c.shortId("a0a011aeb8aa6aa058232c58143fe66cdd80f55cda6c7e1005e9079b92a53b4d")).toBe("a0a011aeb8aa…");
    });
});

describe("ExperimentCreateContainerComponent", () => {
    const orgConfig = {
        id: 7,
        simConfigs: [{ days: 5 }],
        configuratorParams: {
            data: {
                spans: 3, layers: 2, graph: "top-down", actionStateProbability: 0.85, hybridNoise: 0.5,
                gains: { influence: 0.00005, judgment: 0.00004, incentive: 0.00009 },
                matrixInit: { influence: "random", judgment: "random", incentive: "purposeful" },
                reporting: { unitPrice: 1, unitPayroll: 1 },
                board: { controlStep: true }
            }
        }
    };
    const create = (query: { [k: string]: string }, service: any) => {
        const route: any = { snapshot: { queryParamMap: { get: (k: string) => query[k] ?? null } } };
        return new ExperimentCreateContainerComponent(route, router(), service, spinner());
    };

    it("pre-fills from an org config, keeps unshown settings and leaves the control step to the experiment", () => {
        const c = create({ orgConfig: "7" }, { getOrgConfig$: () => of(orgConfig) });
        c.ngOnInit();
        expect(c.source).toBe("OrgConfig 7");
        expect(c.form!.days).toBe(5);
        expect(c.form!.orgConfigs).toBe(100);
        c.form!.gains.influence = 0.00001;
        c.form!.matrixInit.influence = "purposeful";
        const config = c.config();
        expect(config.gains).toEqual({ influence: 0.00001, judgment: 0.00004, incentive: 0.00009 });
        expect(config.matrixInit.influence).toBe("purposeful");
        expect(config.hybridNoise).toBe(0.5);
        expect(config.board).toBeUndefined();
        expect(c.problems()).toEqual([]);
    });

    it("submits a control experiment SimSet and reports invalid input", () => {
        let body: any = null;
        const service: any = { getOrgConfig$: () => of(orgConfig), createSimSet$: (b: any) => { body = b; return of({ id: 42 }); } };
        const c = create({ orgConfig: "7" }, service);
        c.ngOnInit();
        c.form!.orgConfigs = 1;
        expect(c.problems().length).toBe(1);
        c.submit();
        expect(body).toBeNull(); // not submitted while invalid
        c.form!.orgConfigs = 200;
        c.submit();
        expect(body.optimiserName).toBe("C1ControlExperimentOptimiser");
        expect(body.optimiserParams.orgConfigs).toBe(200);
        expect(body.simConfigParams).toEqual({ days: 5, randomStreamType: "random" });
    });

    it("doubles the org configs when re-running an earlier experiment", () => {
        const simSet = { id: 3, description: "exp", simConfigParams: { days: 2 }, optimiserParams: { orgConfigs: 60, config: orgConfig.configuratorParams.data } };
        const c = create({ simSet: "3" }, { getSimSet$: () => of(simSet) });
        c.ngOnInit();
        expect(c.source).toBe("SimSet 3");
        expect(c.form!.orgConfigs).toBe(120);
    });
});

describe("ControlExperimentResultComponent", () => {
    it("states whether the step has a detectable effect", () => {
        const c = new ControlExperimentResultComponent();
        const base = { control: 200, test: 160, standardError: 2.5, relativeDelta: -0.2, pairs: 8, testBetter: 0, controlBetter: 8, ties: 0 };
        expect(c.verdict({ ...base, delta: -40, ci95: [-44.9, -35.1], significant: true })).toContain("lowers performance by 40.00");
        expect(c.verdict({ ...base, delta: 1, ci95: [-3.9, 5.9], significant: false })).toContain("No detectable effect");
    });
});

describe("MonitorContainerComponent fleet scaling", () => {
    const fleet = { enabled: true, group: "arion-nodes", desired: 2, min: 0, max: 8, instances: [] };
    const setup = () => {
        const calls: number[] = [];
        const service: any = {
            getProgress$: () => of(null),
            scaleFleet$: (n: number) => { calls.push(n); return of({ ...fleet, desired: n }); }
        };
        return { c: new MonitorContainerComponent(service), calls };
    };

    it("scales after confirmation and states the start-up delay", () => {
        const { c, calls } = setup();
        c.ngOnInit();
        let asked = "";
        c.scaleFleet(fleet, 4, (m) => { asked = m; return true; });
        expect(asked).toContain("Run 4 node instances (now 2)");
        expect(calls).toEqual([4]);
        expect(c.fleetTarget).toBe(4);
        expect(c.fleetMessage).toContain("5 minutes");
        c.scaleFleet(fleet, 0, (m) => { asked = m; return true; });
        expect(asked).toContain("Stop every node instance");
        expect(calls).toEqual([4, 0]);
        c.ngOnDestroy();
    });

    it("does nothing without confirmation, for the current size, or out of range", () => {
        const { c, calls } = setup();
        c.scaleFleet(fleet, 3, () => false);
        c.scaleFleet(fleet, 2, () => true);
        c.scaleFleet(fleet, 9, () => true);
        c.scaleFleet(fleet, -1, () => true);
        c.scaleFleet({ enabled: false }, 1, () => true);
        expect(calls).toEqual([]);
    });
});

describe("MonitorContainerComponent fleet scaling, unchanged fleet", () => {
    it("reports a change the fleet does not show instead of success", () => {
        const fleet = { enabled: true, group: "arion-nodes", desired: 0, min: 0, max: 8, instances: [] };
        const service: any = { getProgress$: () => of(null), scaleFleet$: () => of({ ...fleet, desired: 0 }) };
        const c = new MonitorContainerComponent(service);
        c.scaleFleet(fleet, 3, () => true);
        expect(c.fleetMessage).toContain("was not changed");
        expect(c.fleetTarget).toBe(0);
    });
});

describe("API definition (swagger.json)", () => {
    it("uses only methods the API client sends as such (it turns any other method, e.g. PUT, into GET)", () => {
        const spec: any = require("../swagger/swagger.json");
        const methods = new Set<string>();
        for (const path of Object.keys(spec.paths)) for (const method of Object.keys(spec.paths[path])) methods.add(method.toLowerCase());
        for (const method of methods) expect(["get", "post", "patch", "delete"]).toContain(method);
        expect(spec.paths["/arion/fleet/scale"].post.operationId).toBe("FleetController_scale");
    });
});

describe("MonitorContainerComponent processes", () => {
    const proc = (id: string, instance: string | null, extra: any = {}): any => ({
        id, machineId: id.split(":")[0], instance, state: "idle", runId: null, simConfigId: null, clockTick: null, totalClockTicks: null,
        runStartedAt: null, completedRuns: 0, failedRuns: 0, averageRunMs: null, lastError: null, memoryMb: null, version: null,
        lastHeartbeatAt: "2026-01-01T00:00:00Z", silent: false, outdated: false, ...extra
    });
    const c = new MonitorContainerComponent({} as any);

    it("groups processes under their instance, fleet instances first, by process index", () => {
        const fleet: any = { enabled: true, instances: [{ id: "i-1", phase: "running" }] };
        const groups = c.processGroups([proc("m:mini:p9", "mini"), proc("f:i-1:10", "i-1"), proc("f:i-1:2", "i-1"), proc("x", null)], fleet);
        expect(groups.map((g) => [g.instance, g.phase, g.processes.map((p) => c.processIndex(p))])).toEqual([
            ["i-1", "running", ["2", "10"]],
            ["mini", null, ["p9"]],
            ["x", null, ["x"]]
        ]);
        expect(c.processGroups(undefined, null)).toEqual([]);
    });

    it("shows run progress and durations", () => {
        expect(c.runPercent(proc("a", null, { clockTick: 1440, totalClockTicks: 5760 }))).toBe(25);
        expect(c.runPercent(proc("a", null))).toBeNull();
        expect([c.duration(null), c.duration(41000), c.duration(192000), c.duration(5400000)]).toEqual(["–", "41 s", "3.2 min", "1.5 h"]);
    });
});
