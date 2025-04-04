import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResultSet, SimConfigDTO, SimSetDTO } from "aethon-arion-pipeline";
import { concatMap, Observable, map } from "rxjs";
import { Paginated } from "aethon-paginate-types";
import { AnalystService } from "src/app/analyst/services/analyst.service";

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

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

}
