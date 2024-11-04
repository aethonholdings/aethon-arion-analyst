import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfiguratorParamsDTO, ResultSet, SimConfigDTO, SimSetDTO } from "aethon-arion-pipeline";
import { concatMap, Observable, map, finalize } from "rxjs";
import { Paginated } from "aethon-paginate-types";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-set-view-container",
    templateUrl: "./sim-set-view-container.component.html",
    styleUrls: ["./sim-set-view-container.component.scss"]
})
export class SimSetViewContainerComponent {
    @Input() simSet$: Observable<SimSetDTO>;
    simSetId: number;
    simConfigs$: Observable<Paginated<SimConfigDTO>> | undefined;
    simSetRefresh$: Observable<SimSetDTO>;
    resultSet$: Observable<ResultSet> | undefined;
    refreshing: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp !== null) {
            this.simSetId = Number.parseInt(tmp);
            this.simSetId
                ? (this.simSet$ = this.analystService.getSimSet$(this.simSetId))
                : (this.simSet$ = new Observable<SimSetDTO>());
            (this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
                map(() => (this.refreshing = true)),
                concatMap(() => this.analystService.getSimSet$(this.simSetId, false))
            )),
                map(() => (this.refreshing = false));
        } else {
            throw new Error("No simSetId provided");
        }
    }

    navigateToSimConfig(id: number) {
        this.router.navigate(["/sim-config", id]);
    }

    loadSimConfigs(pageNumber?: number) {
        this.simConfigs$ = this.analystService.getSimSetSimConfigs$(this.simSetId, pageNumber);
    }

    loadResultSet() {
        if (!this.resultSet$)
            this.resultSet$ = this.analystService.getSimSetResultSet$(this.simSetId).pipe(
                map((resultSet) => {
                    return new ResultSet(resultSet.data);
                })
            );
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    generateSimConfigs(batch: ConfiguratorParamsDTO[]) {
        this.analystService
            .generateConfigurationBatch$(this.simSetId, batch)
            .pipe(finalize(() => location.reload()))
            .subscribe();
    }
}
