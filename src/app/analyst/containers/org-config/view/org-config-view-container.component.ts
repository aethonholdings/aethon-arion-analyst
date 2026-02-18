import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Observable, tap } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

@Component({
    selector: "arion-org-config-view-container",
    templateUrl: "./org-config-view-container.component.html",
    styleUrls: ["./org-config-view-container.component.scss"]
})
export class OrgConfigViewContainerComponent {
    orgConfig$!: Observable<OrgConfigDTO>;
    views = Views;
    breadcrumbs: Breadcrumb[] = [];
    orgConfigId: number;
    activeTab: string = 'config';
    private simSetId: string | null;
    private optimiserStateId: string | null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService,
        private router: Router
    ) {
        this.orgConfigId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.orgConfig$ = this.analystService.getOrgConfig$(this.orgConfigId).pipe(
            tap(orgConfig => {
                if (orgConfig.simConfigs) {
                    orgConfig.simConfigs.forEach(sc => (sc as any).orgConfig = orgConfig);
                }
            })
        );

        // Check navigation context for breadcrumbs
        this.simSetId = this.activatedRoute.snapshot.queryParamMap.get("simSetId");
        this.optimiserStateId = this.activatedRoute.snapshot.queryParamMap.get("optimiserStateId");
        const simSetId = this.simSetId;
        const optimiserStateId = this.optimiserStateId;

        if (simSetId && optimiserStateId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `Optimiser State ${optimiserStateId}`, route: ['/optimiser-state', optimiserStateId] },
                { label: `OrgConfig ${this.orgConfigId}` }
            ];
        } else if (simSetId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `OrgConfig ${this.orgConfigId}` }
            ];
        } else {
            this.breadcrumbs = [
                { label: `OrgConfig ${this.orgConfigId}` }
            ];
        }
    }

    onSimConfigSelected(simConfigId: number) {
        const queryParams: any = { orgConfigId: this.orgConfigId };
        if (this.simSetId) queryParams.simSetId = this.simSetId;
        if (this.optimiserStateId) queryParams.optimiserStateId = this.optimiserStateId;
        this.router.navigate(['/sim-config', simConfigId], { queryParams });
    }
}
