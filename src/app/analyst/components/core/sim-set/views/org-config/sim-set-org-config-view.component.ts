import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { StepData } from "src/app/analyst/containers/sim-set/org-config/sim-set-org-config-container.component";
import { OrgConfigTableRow, SimConfigClickEvent } from "../../../org-config/views/table/org-config-table.component";

@Component({
    selector: "arion-sim-set-org-config-view",
    templateUrl: "./sim-set-org-config-view.component.html",
    styleUrls: ["./sim-set-org-config-view.component.scss"]
})
export class SimSetOrgConfigViewComponent implements OnChanges {
    @Input() stepsData!: StepData[];
    @Input() simSetId!: number;
    tableRows: OrgConfigTableRow[] = [];

    constructor(private router: Router) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['stepsData'] && this.stepsData) {
            this.tableRows = this.stepsData.flatMap(step =>
                step.orgConfigs.map(oc => ({
                    stepCount: step.stepCount,
                    optimiserStateId: step.optimiserStateId,
                    orgConfigId: oc.orgConfigId,
                    configHash: this.getOrgConfigHash(oc.orgConfig),
                    state: oc.state,
                    simConfigs: oc.simConfigs
                }))
            );
        }
    }

    navigateToSimConfig(event: SimConfigClickEvent) {
        const queryParams: any = {
            simSetId: this.simSetId,
            orgConfigId: event.orgConfigId
        };
        if (event.optimiserStateId) queryParams.optimiserStateId = event.optimiserStateId;
        this.router.navigate(['/sim-config', event.simConfigId], { queryParams });
    }

    navigateToOrgConfig(orgConfigId: number) {
        this.router.navigate(['/org-config', orgConfigId], {
            queryParams: { simSetId: this.simSetId }
        });
    }

    navigateToOptimiserState(optimiserStateId: number) {
        this.router.navigate(['/optimiser-state', optimiserStateId]);
    }

    private getOrgConfigHash(orgConfig: any): string {
        if (!orgConfig) {
            return '00000000';
        }
        const seen = new WeakSet();
        const jsonStr = JSON.stringify(orgConfig, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        });
        let hash = 0;
        for (let i = 0; i < jsonStr.length; i++) {
            const char = jsonStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
}
