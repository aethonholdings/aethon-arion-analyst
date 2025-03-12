import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResultDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-result-view-container",
    templateUrl: "./result-view-container.component.html",
    styleUrls: ["./result-view-container.component.scss"]
})
export class ResultViewContainerComponent {
    @Input() result$: Observable<ResultDTO>;
    views = Views;
    // stateSpace$: Observable<StateSpace> | undefined;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        const id: number = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.result$ = this.analystService.getResult$(id);
    }

    getStateSpace$(resultId: number | undefined): void {
        // resultId ? (this.stateSpace$ = this.analystService.getStateSpace$(resultId)) : undefined;
    }
}
