import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimSetDTO, StateType } from "aethon-arion-pipeline";
import { Observable, Subject, interval, map, mergeMap, takeUntil, tap } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";

import { Views } from "src/app/analyst/constants/analyst.constants";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";
import { StepData, OrgConfigGroup } from "../org-config/sim-set-org-config-container.component";

@Component({
    selector: "arion-sim-set-view-container",
    templateUrl: "./sim-set-view-container.component.html",
    styleUrls: ["./sim-set-view-container.component.scss"]
})
export class SimSetViewContainerComponent implements OnInit, OnDestroy {
    @Input() simSet$!: Observable<SimSetDTO>;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    simSetId: number;
    simSetRefresh$!: Observable<SimSetDTO>;
    stepsData$!: Observable<StepData[]>;
    refreshing: boolean = false;
    views = Views;
    activeTab: string = 'optimiser-steps';
    secondsUntilRefresh: number = 60;
    private destroy$ = new Subject<void>();
    breadcrumbs: Breadcrumb[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService,
        private spinnerService: SpinnerService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp) {
            this.simSetId = Number.parseInt(tmp);
        } else {
            throw new Error("No simSetId provided");
        }

        this.breadcrumbs = [
            { label: 'SimSets', route: ['/sim-set'] },
            { label: `SimSet ${this.simSetId}` }
        ];
    }

    ngOnInit() {
        // Countdown timer (updates every second)
        interval(1000).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.secondsUntilRefresh = this.secondsUntilRefresh > 0 ? this.secondsUntilRefresh - 1 : 60;
        });

        // Auto-refresh timer (every 60 seconds)
        this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
            tap(() => {
                setTimeout(() => {
                    this.refreshing = true;
                    this.secondsUntilRefresh = 60;
                    this.spinnerService.show();
                });
            }),
            mergeMap(() => {
                return this.analystService.getSimSet$(this.simSetId);
            }),
            tap(() => {
                setTimeout(() => {
                    this.refreshing = false;
                    this.spinnerService.hide();
                });
            })
        );

        // Process sim-set data for org-config view
        this.stepsData$ = this.simSetRefresh$.pipe(
            map(simSet => {
                const stepsData: StepData[] = [];

                if (simSet.optimiserStates) {
                    for (const optimiserState of simSet.optimiserStates) {
                        const orgConfigMap = new Map<number, OrgConfigGroup>();

                        // Process convergence tests to group by org config
                        if ((optimiserState as any).convergenceTests) {
                            for (const convergenceTest of (optimiserState as any).convergenceTests) {
                                if (convergenceTest.simConfigs) {
                                    for (const simConfig of convergenceTest.simConfigs) {
                                        const orgConfigId = simConfig.orgConfigId || simConfig.orgConfig?.id;
                                        const configuratorParams = simConfig.orgConfig?.configuratorParams
                                            ? JSON.stringify(simConfig.orgConfig.configuratorParams)
                                            : 'No params';

                                        if (!orgConfigMap.has(orgConfigId)) {
                                            orgConfigMap.set(orgConfigId, {
                                                orgConfigId: orgConfigId,
                                                orgConfig: simConfig.orgConfig,
                                                configuratorParams: configuratorParams,
                                                state: 'pending',
                                                simConfigs: []
                                            });
                                        }

                                        orgConfigMap.get(orgConfigId)!.simConfigs.push({
                                            id: simConfig.id,
                                            avgPerformance: simConfig.avgPerformance || null,
                                            state: simConfig.state || 'pending'
                                        });
                                    }
                                }
                            }
                        }

                        // Derive aggregate state for each orgConfig group
                        const statePriority: StateType[] = ['failed', 'running', 'pending', 'completed'];
                        for (const group of orgConfigMap.values()) {
                            const states = group.simConfigs.map(sc => sc.state);
                            group.state = statePriority.find(s => states.includes(s)) || 'pending';
                        }

                        stepsData.push({
                            stepCount: optimiserState.stepCount,
                            optimiserStateId: optimiserState.id!,
                            orgConfigs: Array.from(orgConfigMap.values())
                        });
                    }
                }

                return stepsData;
            })
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    manualRefresh() {
        this.secondsUntilRefresh = 60;
        // Just navigate to trigger a reload
        this.router.navigate(['/sim-set', this.simSetId], {
            queryParams: { refresh: Date.now() }
        });
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    onSelect(optimiserStateId: number) {
        this.router.navigate(["/optimiser-state", optimiserStateId])
    }
}
