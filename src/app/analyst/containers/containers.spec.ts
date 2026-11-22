import { Subject, of, throwError } from "rxjs";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { OptimiserStateViewContainerComponent } from "./optimiser-state/view/optimiser-state-view-container.component";
import { OrgConfigIndexContainerComponent } from "./org-config/index/org-config-index-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { OptimiserStateViewComponent } from "../components/core/optimiser-state/view/optimiser-state-view.component";
import { C1 } from "aethon-arion-c1";
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
