import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimConfigDTO, ResultDTO } from "aethon-arion-pipeline";
import { Observable, tap } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

@Component({
    selector: "arion-sim-config-view-container",
    templateUrl: "./sim-config-view-container.component.html",
    styleUrls: ["./sim-config-view-container.component.scss"]
})
export class SimConfigViewContainerComponent {
    @Input() simConfig$: Observable<SimConfigDTO>;
    results$: Observable<ResultDTO[]> | undefined;
    performanceValues: number[] = [];
    views = Views;
    activeTab: string = 'summary';
    breadcrumbs: Breadcrumb[] = [];
    simConfigId: number;
    private simSetId: string | null;
    private optimiserStateId: string | null;
    private orgConfigId: string | null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService,
        private router: Router
    ) {
        this.simConfigId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.simConfig$ = this.analystService.getSimConfig$(this.simConfigId);

        this.simSetId = this.activatedRoute.snapshot.queryParamMap.get("simSetId");
        this.optimiserStateId = this.activatedRoute.snapshot.queryParamMap.get("optimiserStateId");
        this.orgConfigId = this.activatedRoute.snapshot.queryParamMap.get("orgConfigId");
        const simSetId = this.simSetId;
        const optimiserStateId = this.optimiserStateId;
        const orgConfigId = this.orgConfigId;

        const orgConfigQueryParams: any = {};
        if (simSetId) orgConfigQueryParams.simSetId = simSetId;
        if (optimiserStateId) orgConfigQueryParams.optimiserStateId = optimiserStateId;

        if (simSetId && optimiserStateId && orgConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `Optimiser State ${optimiserStateId}`, route: ['/optimiser-state', optimiserStateId] },
                { label: `OrgConfig ${orgConfigId}`, route: ['/org-config', orgConfigId], queryParams: orgConfigQueryParams },
                { label: `SimConfig ${this.simConfigId}` }
            ];
        } else if (simSetId && optimiserStateId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `Optimiser State ${optimiserStateId}`, route: ['/optimiser-state', optimiserStateId] },
                { label: `SimConfig ${this.simConfigId}` }
            ];
        } else if (simSetId && orgConfigId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `OrgConfig ${orgConfigId}`, route: ['/org-config', orgConfigId], queryParams: orgConfigQueryParams },
                { label: `SimConfig ${this.simConfigId}` }
            ];
        } else if (simSetId) {
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                { label: `SimConfig ${this.simConfigId}` }
            ];
        } else {
            this.breadcrumbs = [
                { label: `SimConfig ${this.simConfigId}` }
            ];
        }
    }

    getResults$(simConfigId: number | undefined): void {
        if (simConfigId && !this.results$) {
            this.results$ = this.analystService.getSimConfigResultSet$(simConfigId).pipe(
                tap(results => {
                    this.performanceValues = results
                        .map(r => r.performance)
                        .filter((v): v is number => v !== null && v !== undefined);
                })
            );
        } else {
            throw new Error("simConfigId is undefined");
        }
    }

    navigateToResult(id: number): void {
        const queryParams: any = { simConfigId: this.simConfigId };
        if (this.simSetId) queryParams.simSetId = this.simSetId;
        if (this.optimiserStateId) queryParams.optimiserStateId = this.optimiserStateId;
        if (this.orgConfigId) queryParams.orgConfigId = this.orgConfigId;
        this.router.navigate(["/result", id], { queryParams });
    }
}
