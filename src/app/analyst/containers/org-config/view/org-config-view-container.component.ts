import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
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

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        this.orgConfigId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.orgConfig$ = this.analystService.getOrgConfig$(this.orgConfigId);

        // Check if navigated from sim-set context
        const simSetId = this.activatedRoute.snapshot.queryParamMap.get("simSetId");

        if (simSetId) {
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
}
