import { Component, Input } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystModelsService } from "../../services/analyst-models.service";

@Component({
    selector: "arion-sim-set",
    templateUrl: "./sim-set.component.html",
    styleUrls: ["./sim-set.component.scss"]
})
export class SimSetComponent {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;

    constructor(private analystModelsService: AnalystModelsService) {}

    getPercentComplete(): string {
        return this.analystModelsService.getSimSetPercentComplete(this.simSet);
    }
}
