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
    id: number;
    simConfigs$: Observable<Paginated<SimConfigDTO>> | undefined;
    simSetRefresh$: Observable<SimSetDTO>;
    resultSet$: Observable<ResultSet> | undefined;
    refreshing: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.id
            ? (this.simSet$ = this.analystService.getSimSet$(this.id))
            : (this.simSet$ = new Observable<SimSetDTO>());
        (this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
            map(() => (this.refreshing = true)),
            concatMap(() => this.analystService.getSimSet$(this.id, false))
        )),
            map(() => (this.refreshing = false));
    }

    navigateToSimConfig(id: number) {
        this.router.navigate(["/sim-config", id]);
    }

    loadSimConfigs(pageNumber?: number) {
        this.simConfigs$ = this.analystService.getSimSetSimConfigs$(this.id, pageNumber);
    }

    loadResultSet() {
        if (!this.resultSet$)
            this.resultSet$ = this.analystService.getSimSetResultSet$(this.id).pipe(
                map((resultSet) => {
                    return new ResultSet(resultSet);
                })
            );
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.id).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    generateSimConfigs(batch: ConfiguratorParamsDTO[]) {
        this.analystService
            .generateConfigurationBatch$(this.id, batch)
            .pipe(finalize(() => location.reload()))
            .subscribe();
    }
}
