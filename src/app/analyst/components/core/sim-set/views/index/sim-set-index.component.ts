import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystService } from "../../../../../services/analyst.service";

@Component({
    selector: "arion-sim-set-index",
    templateUrl: "./sim-set-index.component.html",
    styleUrls: ["./sim-set-index.component.scss"]
})
export class SimSetIndexComponent {
    @Input() simSets: SimSetDTO[] | undefined;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    @Output() clone: EventEmitter<number> = new EventEmitter<number>();

    constructor(private analystService: AnalystService) {}

    selectSimSet(id: number | undefined): void {
        if (id) {
            this.selected.emit(id);
        }
    }

    cloneSimSet(id: number | undefined, event: Event): void {
        event.stopPropagation();
        if (id) {
            this.clone.emit(id);
        }
    }

    getPercentComplete(simSet: SimSetDTO): string {
        return this.analystService.getPercentComplete(simSet);
    }
}
