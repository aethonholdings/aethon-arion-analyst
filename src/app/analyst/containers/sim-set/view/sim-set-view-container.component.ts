import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfiguratorParamsDTO, ResultDTO, ResultSet, SimConfigDTO, SimSetDTO } from "aethon-arion-pipeline";
import { concatMap, Observable, map, finalize, last, catchError } from "rxjs";
import { Paginated } from "aethon-paginate-types";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { SpinnerService } from "src/app/root/services/spinner.service";
import { ProgressState } from "src/app/root/types/root.types";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-sim-set-view-container",
    templateUrl: "./sim-set-view-container.component.html",
    styleUrls: ["./sim-set-view-container.component.scss"]
})
export class SimSetViewContainerComponent<T> {
    @Input() simSet$: Observable<SimSetDTO>;
    simSetId: number;
    simConfigs$: Observable<Paginated<SimConfigDTO>> | undefined;
    simSetRefresh$: Observable<SimSetDTO>;
    resultSet$: Observable<ResultSet> | undefined;
    refreshing: boolean = false;
    views = Views;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService,
        private spinnerService: SpinnerService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp !== null) {
            this.simSetId = Number.parseInt(tmp);
            this.simSetId
                ? (this.simSet$ = this.analystService.getSimSet$(this.simSetId))
                : (this.simSet$ = new Observable<SimSetDTO>());
            (this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
                map(() => (this.refreshing = true)),
                concatMap(() => this.analystService.getSimSet$(this.simSetId))
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
        let results: any = [];
        if (!this.resultSet$) this.spinnerService.show();
        this.resultSet$ = this.analystService.getSimSetResultSet$(this.simSetId).pipe(
            map((progress: ProgressState<ResultDTO[]>) => {
                results = results.concat(progress.data);
                this.spinnerService.updateProgress(`${progress.progressPercent}%`);
                return results;
            }),
            last(),
            map(() => new ResultSet(results)),
            finalize(() => this.spinnerService.hide()),
            catchError((error) => {
                this.spinnerService.hide();
                throw error;
            })
        );
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    generateSimConfigs(batch: ConfiguratorParamsDTO<T>[]) {
        this.analystService
            .generateConfigurationBatch$(this.simSetId, batch)
            .pipe(finalize(() => location.reload()))
            .subscribe();
    }
}
