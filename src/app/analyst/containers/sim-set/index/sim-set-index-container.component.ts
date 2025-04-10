import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { map, mergeMap, Observable, tap } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-set-index-container",
    templateUrl: "./sim-set-index-container.component.html",
    styleUrls: ["./sim-set-index-container.component.scss"]
})
export class SimSetIndexContainerComponent implements OnInit {
    @Input() simSets$!: Observable<SimSetDTO[]>;
    refreshing: boolean = false;
    views = Views;

    constructor(
        private analystService: AnalystService,
        private router: Router
    ) {}

    ngOnInit() {
        this.simSets$ = this.analystService.getRefeshTimer$().pipe(
            map(() => (this.refreshing = true)),
            mergeMap(() => this.analystService.getSimSets$()),
            tap(() => (this.refreshing = false))
        );
    }

    navigateToSimSet(id: number): void {
        this.router.navigate(["/sim-set", id]);
    }

    createSimSim(): void {
        this.router.navigate(["/sim-set", "create"]);
    }
}
