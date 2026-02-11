import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimConfigDTO, ResultDTO } from "aethon-arion-pipeline";
import { Observable, map } from "rxjs";
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
    views = Views;
    activeTab: string = 'summary';
    breadcrumbs$!: Observable<Breadcrumb[]>;
    simConfigId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService,
        private router: Router
    ) {
        this.simConfigId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.simConfig$ = this.analystService.getSimConfig$(this.simConfigId);

        this.breadcrumbs$ = this.simConfig$.pipe(
            map(simConfig => {
                const simSetId = (simConfig as any).convergenceTest?.optimiserStates?.[0]?.simSet?.id;
                return [
                    { label: 'SimSets', route: ['/sim-set'] },
                    { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId?.toString()] },
                    { label: `SimConfig ${this.simConfigId}` }
                ];
            })
        );
    }

    getResults$(simConfigId: number | undefined): void {
        if (simConfigId && !this.results$) {
            this.results$ = this.analystService.getSimConfigResultSet$(simConfigId);
        } else {
            throw new Error("simConfigId is undefined");
        }
    }

    navigateToResult(id: number): void {
        this.router.navigate(["/result", id]);
    }
}
