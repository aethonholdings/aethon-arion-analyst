import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfiguratorParamData, OptimiserStateDTO } from "aethon-arion-pipeline";
import { Observable, Subject, interval, map, mergeMap, takeUntil, tap } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

@Component({
    selector: "arion-optimiser-state-view-container",
    templateUrl: "./optimiser-state-view-container.component.html",
    styleUrls: ["./optimiser-state-view-container.component.scss"]
})
export class OptimiserStateViewContainerComponent implements OnInit, OnDestroy {
    @Input() optimiserState$!: Observable<OptimiserStateDTO<ConfiguratorParamData>>;
    optimiserStateRefresh$!: Observable<OptimiserStateDTO<ConfiguratorParamData>>;
    views = Views;
    breadcrumbs$!: Observable<Breadcrumb[]>;
    optimiserStateId: number;
    refreshing: boolean = false;
    secondsUntilRefresh: number = 60;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService,
        private spinnerService: SpinnerService,
        private router: Router
    ) {
        this.optimiserStateId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
    }

    ngOnInit() {
        // Countdown timer (updates every second)
        interval(1000).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.secondsUntilRefresh = this.secondsUntilRefresh > 0 ? this.secondsUntilRefresh - 1 : 60;
        });

        // Auto-refresh timer (every 60 seconds)
        this.optimiserStateRefresh$ = this.analystService.getRefeshTimer$().pipe(
            tap(() => {
                setTimeout(() => {
                    this.refreshing = true;
                    this.secondsUntilRefresh = 60;
                    this.spinnerService.show();
                });
            }),
            mergeMap(() => {
                return this.analystService.getOptimiserState$(this.optimiserStateId);
            }),
            tap(() => {
                setTimeout(() => {
                    this.refreshing = false;
                    this.spinnerService.hide();
                });
            })
        );

        this.optimiserState$ = this.optimiserStateRefresh$;

        this.breadcrumbs$ = this.optimiserState$.pipe(
            map(optimiserState => {
                const simSetId = (optimiserState as any).simSet?.id;
                return [
                    { label: 'SimSets', route: ['/sim-set'] },
                    { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                    { label: `OptimiserState ${this.optimiserStateId}` }
                ];
            })
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    manualRefresh() {
        this.secondsUntilRefresh = 60;
        // Navigate to trigger a reload
        this.router.navigate(['/optimiser-state', this.optimiserStateId], {
            queryParams: { refresh: Date.now() }
        });
    }
}
