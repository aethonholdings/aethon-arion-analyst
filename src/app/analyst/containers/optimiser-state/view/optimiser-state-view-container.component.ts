import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConfiguratorParamData, OptimiserStateDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-optimiser-state-view-container",
    templateUrl: "./optimiser-state-view-container.component.html",
    styleUrls: ["./optimiser-state-view-container.component.scss"]
})
export class OptimiserStateViewContainerComponent {
    @Input() optimiserState$!: Observable<OptimiserStateDTO<ConfiguratorParamData>>;
    views = Views;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        const id: number = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.optimiserState$ = this.analystService.getOptimiserState$(id);
    }
}
