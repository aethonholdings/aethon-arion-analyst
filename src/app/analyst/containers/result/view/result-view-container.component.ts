import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResultDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

@Component({
    selector: "arion-result-view-container",
    templateUrl: "./result-view-container.component.html",
    styleUrls: ["./result-view-container.component.scss"]
})
export class ResultViewContainerComponent {
    @Input() result$: Observable<ResultDTO>;
    views = Views;
    activeTab: string = 'reporting';
    breadcrumbs: Breadcrumb[] = [];
    resultId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        this.resultId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.result$ = this.analystService.getResult$(this.resultId);

        const simSetId = this.activatedRoute.snapshot.queryParamMap.get("simSetId");
        const optimiserStateId = this.activatedRoute.snapshot.queryParamMap.get("optimiserStateId");
        const orgConfigId = this.activatedRoute.snapshot.queryParamMap.get("orgConfigId");
        const simConfigId = this.activatedRoute.snapshot.queryParamMap.get("simConfigId");

        const simConfigQueryParams: any = {};
        if (simSetId) simConfigQueryParams.simSetId = simSetId;
        if (optimiserStateId) simConfigQueryParams.optimiserStateId = optimiserStateId;
        if (orgConfigId) simConfigQueryParams.orgConfigId = orgConfigId;

        const orgConfigQueryParams: any = {};
        if (simSetId) orgConfigQueryParams.simSetId = simSetId;
        if (optimiserStateId) orgConfigQueryParams.optimiserStateId = optimiserStateId;

        if (simSetId && optimiserStateId && orgConfigId && simConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `Optimiser State ${optimiserStateId}`, route: ['/optimiser-state', optimiserStateId] },
                { label: `OrgConfig ${orgConfigId}`, route: ['/org-config', orgConfigId], queryParams: orgConfigQueryParams },
                { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId], queryParams: simConfigQueryParams },
                { label: `Result ${this.resultId}` }
            ];
        } else if (simSetId && optimiserStateId && simConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `Optimiser State ${optimiserStateId}`, route: ['/optimiser-state', optimiserStateId] },
                { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId], queryParams: simConfigQueryParams },
                { label: `Result ${this.resultId}` }
            ];
        } else if (simSetId && orgConfigId && simConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `OrgConfig ${orgConfigId}`, route: ['/org-config', orgConfigId], queryParams: orgConfigQueryParams },
                { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId], queryParams: simConfigQueryParams },
                { label: `Result ${this.resultId}` }
            ];
        } else if (simSetId && simConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId], queryParams: simConfigQueryParams },
                { label: `Result ${this.resultId}` }
            ];
        } else if (simConfigId) {
            this.breadcrumbs = [
                { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId] },
                { label: `Result ${this.resultId}` }
            ];
        } else {
            this.breadcrumbs = [
                { label: `Result ${this.resultId}` }
            ];
        }
    }
}
