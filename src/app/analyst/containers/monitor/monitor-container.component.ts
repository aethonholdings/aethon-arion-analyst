import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { catchError, EMPTY, map, merge, Observable, shareReplay, Subject, switchMap, takeUntil, timer } from "rxjs";
import { AnalystService, ProgressDTO, ProgressSimSetDTO } from "src/app/analyst/services/analyst.service";
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
