import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { Observable, map, mergeMap, tap } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";

import { Views } from "src/app/analyst/constants/analyst.constants";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";

@Component({
    selector: "arion-sim-set-view-container",
    templateUrl: "./sim-set-view-container.component.html",
    styleUrls: ["./sim-set-view-container.component.scss"]
})
export class SimSetViewContainerComponent implements OnInit {
    @Input() simSet$!: Observable<SimSetDTO>;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    simSetId: number;
    simSetRefresh$!: Observable<SimSetDTO>;
    refreshing: boolean = false;
    views = Views;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService,
        private spinnerService: SpinnerService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp) {
            this.simSetId = Number.parseInt(tmp);
        } else {
            throw new Error("No simSetId provided");
        }
    }

    ngOnInit() {
        this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
            map(() => {
                this.refreshing = true;
                this.spinnerService.show();
            }),
            mergeMap(() => {
                return this.analystService.getSimSet$(this.simSetId);
            }),
            tap(() => {
                this.refreshing = false;
                this.spinnerService.hide();
            })
        );
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    onSelect(optimiserStateId: number) {
        console.log(optimiserStateId);
    }
}
