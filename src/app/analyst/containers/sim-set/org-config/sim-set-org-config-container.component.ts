import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, map } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

export interface OrgConfigGroup {
    orgConfigId: number;
    orgConfig: any;
    configuratorParams: string;
    simConfigs: Array<{
        id: number;
        avgPerformance: number | null;
    }>;
}

export interface StepData {
    stepCount: number;
    optimiserStateId: number;
    orgConfigs: OrgConfigGroup[];
}

@Component({
    selector: "arion-sim-set-org-config-container",
    templateUrl: "./sim-set-org-config-container.component.html",
    styleUrls: ["./sim-set-org-config-container.component.scss"]
})
export class SimSetOrgConfigContainerComponent implements OnInit {
    simSetId: number;
    breadcrumbs: Breadcrumb[] = [];
    stepsData$!: Observable<StepData[]>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp) {
            this.simSetId = Number.parseInt(tmp);
        } else {
            throw new Error("No simSetId provided");
        }

        this.breadcrumbs = [
            { label: 'SimSets', route: ['/sim-set'] },
            { label: `SimSet ${this.simSetId}`, route: ['/sim-set', this.simSetId.toString()] },
            { label: 'OrgConfig Analysis' }
        ];
    }

    ngOnInit() {
        this.stepsData$ = this.analystService.getSimSet$(this.simSetId).pipe(
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
                                                simConfigs: []
                                            });
                                        }

                                        orgConfigMap.get(orgConfigId)!.simConfigs.push({
                                            id: simConfig.id,
                                            avgPerformance: simConfig.avgPerformance || null
                                        });
                                    }
                                }
                            }
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
}
