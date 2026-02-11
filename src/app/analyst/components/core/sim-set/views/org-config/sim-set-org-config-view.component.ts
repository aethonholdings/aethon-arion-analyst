import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { StepData } from "src/app/analyst/containers/sim-set/org-config/sim-set-org-config-container.component";

@Component({
    selector: "arion-sim-set-org-config-view",
    templateUrl: "./sim-set-org-config-view.component.html",
    styleUrls: ["./sim-set-org-config-view.component.scss"]
})
export class SimSetOrgConfigViewComponent {
    @Input() stepsData!: StepData[];
    @Input() simSetId!: number;

    constructor(private router: Router) {}

    navigateToSimConfig(simConfigId: number) {
        this.router.navigate(['/sim-config', simConfigId], {
            queryParams: { simSetId: this.simSetId }
        });
    }

    navigateToOrgConfig(orgConfigId: number) {
        this.router.navigate(['/org-config', orgConfigId], {
            queryParams: { simSetId: this.simSetId }
        });
    }

    navigateToOptimiserState(optimiserStateId: number) {
        this.router.navigate(['/optimiser-state', optimiserStateId]);
    }

    getTotalSimConfigsForStep(step: StepData): number {
        return step.orgConfigs.reduce((total, orgConfig) => total + orgConfig.simConfigs.length, 0);
    }

    getHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    getOrgConfigHash(orgConfig: any): string {
        if (!orgConfig) {
            return '00000000';
        }
        // Stringify the entire orgConfig object (handling circular references)
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
        return this.getHash(jsonStr);
    }
}
