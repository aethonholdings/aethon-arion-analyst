import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResultDTO, SimConfigDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-config-view-container",
    templateUrl: "./sim-config-view-container.component.html",
    styleUrls: ["./sim-config-view-container.component.scss"]
})
export class SimConfigViewContainerComponent {
    @Input() simConfig$: Observable<SimConfigDTO>;
    results$: Observable<ResultDTO[]> | undefined;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService,
        private router: Router
    ) {
        const id: number = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.simConfig$ = this.analystService.getSimConfig$(id);
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
