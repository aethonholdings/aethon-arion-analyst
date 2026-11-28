import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { catchError, EMPTY, map, merge, Observable, shareReplay, Subject, switchMap, takeUntil, timer } from "rxjs";
import { AnalystService, FleetDTO, ProgressDTO, ProgressSimSetDTO } from "src/app/analyst/services/analyst.service";
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
                this.fleetTarget = updated.desired ?? desired;
                this.fleetMessage = desired > (fleet.desired ?? 0) ? "New nodes start taking work about 5 minutes after they launch." : null;
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
