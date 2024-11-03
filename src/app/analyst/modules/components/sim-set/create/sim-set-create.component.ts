import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystModelsService } from "../../../models/core/services/analyst-models.service";

@Component({
    selector: "arion-sim-set-create",
    templateUrl: "./sim-set-create.component.html",
    styleUrls: ["./sim-set-create.component.scss"]
})
export class SimSetCreateComponent implements OnInit {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
    @Output() simSetChange: EventEmitter<SimSetDTO> = new EventEmitter<SimSetDTO>();
    models: string[] = [];

    constructor(private analystModelsService: AnalystModelsService) {}

    ngOnInit(): void {
        this.models = this.analystModelsService.getModels();
        this.simSet.type = this.models[0];
    }
}
