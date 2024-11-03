import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystModelsService } from "src/app/models/core/services/analyst-models.service";

@Component({
    selector: "arion-sim-set-index",
    templateUrl: "./sim-set-index.component.html",
    styleUrls: ["./sim-set-index.component.scss"]
})
export class SimSetIndexComponent {
    @Input() simSets: SimSetDTO[] | undefined;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    constructor(private analystModelsService: AnalystModelsService) {}

    selectSimSet(id: number | undefined): void {
        if (id) {
            this.selected.emit(id);
        }
    }

    getPercentComplete(simSet: SimSetDTO): string {
        return this.analystModelsService.getSimSetPercentComplete(simSet);
    }
}
