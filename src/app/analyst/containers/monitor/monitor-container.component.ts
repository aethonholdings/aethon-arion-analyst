import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { catchError, EMPTY, map, merge, Observable, shareReplay, Subject, switchMap, takeUntil, timer } from "rxjs";
import { AnalystService, FleetDTO, ProgressDTO, ProgressProcessDTO, ProgressSimSetDTO } from "src/app/analyst/services/analyst.service";

/** Node processes of one instance (an EC2 fleet instance, or a machine outside the fleet). */
export interface ProcessGroup {
    instance: string;
    phase: string | null;
    processes: ProgressProcessDTO[];
}
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

/** Refresh interval of the monitor (ms). */
export const MONITOR_REFRESH_MS = 10000;

@Component({
    standalone: false,
    selector: "arion-monitor-container",
    templateUrl: "./monitor-container.component.html",
    changeDetection: ChangeDetectionStrategy.Eager
})
export class MonitorContainerComponent implements OnInit, OnDestroy {
    progress$!: Observable<ProgressDTO>;
    fleet$!: Observable<FleetDTO>;
    /** Fleet size being entered; null until the fleet is first loaded. */
    fleetTarget: number | null = null;
    fleetMessage: string | null = null;
    scaling: boolean = false;
    error: string | null = null;
    breadcrumbs: Breadcrumb[] = [{ label: "Monitor" }];
    private refresh$ = new Subject<void>();
    private destroy$ = new Subject<void>();

    constructor(private analystService: AnalystService) {}

    ngOnInit(): void {
        // every MONITOR_REFRESH_MS plus manual refreshes; a failed request keeps the stream (and the last data) alive
        this.progress$ = merge(timer(0, MONITOR_REFRESH_MS), this.refresh$).pipe(
            switchMap(() =>
                this.analystService.getProgress$().pipe(
                    map((progress) => {
                        this.error = null;
                        return progress;
                    }),
                    catchError((error) => {
                        this.error = error?.message ?? "The server did not answer";
                        return EMPTY;
                    })
                )
            ),
            shareReplay({ bufferSize: 1, refCount: true }),
            takeUntil(this.destroy$)
        );
        // the fleet, refreshed with the progress; a server without a fleet answers enabled: false
        this.fleet$ = merge(timer(0, MONITOR_REFRESH_MS), this.refresh$).pipe(
            switchMap(() => this.analystService.getFleet$().pipe(catchError(() => EMPTY))),
            map((fleet) => {
                if (this.fleetTarget === null && fleet.enabled) this.fleetTarget = fleet.desired ?? 0;
                return fleet;
            }),
            shareReplay({ bufferSize: 1, refCount: true }),
            takeUntil(this.destroy$)
        );
    }

    /** Asks for confirmation, then sets the fleet size; the monitor refreshes with the new size. */
    scaleFleet(fleet: FleetDTO, desired: number, confirm: (message: string) => boolean = (m) => window.confirm(m)): void {
        if (!fleet.enabled || desired === fleet.desired || desired < 0 || desired > (fleet.max ?? 0) || !Number.isInteger(desired)) return;
        const message =
            desired === 0
                ? "Stop every node instance? Running simulations are abandoned and handed out again later."
                : `Run ${desired} node instance${desired === 1 ? "" : "s"} (now ${fleet.desired})? Instances are billed while they run.`;
        if (!confirm(message)) return;
        this.scaling = true;
        this.fleetMessage = null;
        this.analystService.scaleFleet$(desired).subscribe({
            next: (updated) => {
                this.scaling = false;
                if (updated?.desired !== desired) {
                    // never report success for a change the fleet does not show
                    this.fleetMessage = `The fleet size was not changed (target ${updated?.desired ?? "unknown"}, requested ${desired}).`;
                    this.fleetTarget = updated?.desired ?? this.fleetTarget;
                } else {
                    this.fleetTarget = desired;
                    this.fleetMessage =
                        desired > (fleet.desired ?? 0)
                            ? `Starting ${desired - (fleet.desired ?? 0)} instance(s): each launches, then builds the node (about 5 minutes) before it takes work.`
                            : null;
                }
                this.refresh();
            },
            error: (error) => {
                this.scaling = false;
                this.fleetMessage = `The fleet could not be scaled: ${error?.message ?? error}`;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    refresh(): void {
        this.refresh$.next();
    }

    /** Converged share of a SimSet's simulation configurations, 0 to 100. */
    convergedPercent(simSet: ProgressSimSetDTO): number {
        return simSet.simConfigs > 0 ? Math.round((100 * simSet.convergedSimConfigs) / simSet.simConfigs) : 0;
    }

    /**
     * Processes grouped by instance, fleet instances first (with their phase), then other machines; within an
     * instance by process index.
     */
    processGroups(processes: ProgressProcessDTO[] | undefined, fleet: FleetDTO | null): ProcessGroup[] {
        const phases = new Map((fleet?.instances ?? []).map((i) => [i.id, i.phase as string]));
        const groups = new Map<string, ProcessGroup>();
        for (const process of processes ?? []) {
            const instance = process.instance ?? process.machineId;
            if (!groups.has(instance)) groups.set(instance, { instance, phase: phases.get(instance) ?? null, processes: [] });
            groups.get(instance)!.processes.push(process);
        }
        const index = (p: ProgressProcessDTO) => p.id.split(":").pop() as string;
        for (const group of groups.values()) group.processes.sort((a, b) => index(a).localeCompare(index(b), undefined, { numeric: true }));
        return [...groups.values()].sort((a, b) => (a.phase === null ? 1 : 0) - (b.phase === null ? 1 : 0) || a.instance.localeCompare(b.instance));
    }

    /** The process index (last part of the node id). */
    processIndex(process: ProgressProcessDTO): string {
        return process.id.split(":").pop() as string;
    }

    /** Run progress, 0 to 100, or null when no run is in progress. */
    runPercent(process: ProgressProcessDTO): number | null {
        if (process.clockTick === null || !process.totalClockTicks) return null;
        return Math.min(100, Math.round((100 * process.clockTick) / process.totalClockTicks));
    }

    /** "45 s", "3.2 min" or "1.4 h". */
    duration(ms: number | null | undefined): string {
        if (ms === null || ms === undefined) return "–";
        if (ms < 60000) return `${Math.round(ms / 1000)} s`;
        if (ms < 3600000) return `${(ms / 60000).toFixed(1)} min`;
        return `${(ms / 3600000).toFixed(1)} h`;
    }

    /** Label and badge style of an instance phase. */
    phaseBadge(phase: string): string {
        return { launching: "badge-info", building: "badge-warning", running: "badge-success", stopping: "badge-ghost" }[phase] ?? "badge-ghost";
    }

    /** "12 s ago", "4 min ago", "3 h ago", or "never". */
    ago(timestamp: string | null, now: string): string {
        if (!timestamp) return "never";
        const seconds = Math.max(0, Math.round((new Date(now).getTime() - new Date(timestamp).getTime()) / 1000));
        if (seconds < 60) return `${seconds} s ago`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
        if (seconds < 172800) return `${Math.round(seconds / 3600)} h ago`;
        return `${Math.round(seconds / 86400)} days ago`;
    }

    /** A machine id shortened for display (hardware ids are 64 hex characters). */
    shortId(id: string): string {
        return id.length > 16 ? id.slice(0, 12) + "…" : id;
    }
}
