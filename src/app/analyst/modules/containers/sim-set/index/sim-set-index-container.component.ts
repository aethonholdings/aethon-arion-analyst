import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { map, mergeMap, Observable, of } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-set-index-container",
    templateUrl: "./sim-set-index-container.component.html",
    styleUrls: ["./sim-set-index-container.component.scss"]
})
export class SimSetIndexContainerComponent {
    @Input() simSets$: Observable<SimSetDTO[]>;
    refreshing: boolean = false;

    constructor(
        private analystService: AnalystService,
        private router: Router
    ) {
        this.simSets$ = this.analystService.getRefeshTimer$().pipe(
          map(() => this.refreshing = true),
          mergeMap(() => this.analystService.getSimSets$(false)),
          map((simSets) => {this.refreshing = false; return simSets})
        );
    }

    navigateToSimSet(id: number): void {
        this.router.navigate(["/sim-set", id]);
    }

    createSimSim(): void {
        this.router.navigate(["/sim-set", "create"]);
    }
}
