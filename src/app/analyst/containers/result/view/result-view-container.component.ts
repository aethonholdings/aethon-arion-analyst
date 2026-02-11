import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResultDTO } from "aethon-arion-pipeline";
import { Observable, map } from "rxjs";
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
    breadcrumbs$!: Observable<Breadcrumb[]>;
    resultId: number;
    // stateSpace$: Observable<StateSpace> | undefined;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        this.resultId = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.result$ = this.analystService.getResult$(this.resultId);

        this.breadcrumbs$ = this.result$.pipe(
            map(result => {
                const simSetId = (result as any).simSetId;
                const simConfigId = (result as any).simConfigId;
                return [
                    { label: 'SimSets', route: ['/sim-set'] },
                    { label: `SimSet ${simSetId}`, route: ['/sim-set', simSetId] },
                    { label: `SimConfig ${simConfigId}`, route: ['/sim-config', simConfigId] },
                    { label: `Result ${this.resultId}` }
                ];
            })
        );
    }

    // getStateSpace$(resultId: number | undefined): void {
    //     resultId ? (this.stateSpace$ = this.analystService.getStateSpace$(resultId)) : undefined;
    // }
}
