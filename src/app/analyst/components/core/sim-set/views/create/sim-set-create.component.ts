import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { C1ModelName, C1OptimiserNames } from "aethon-arion-c1";
import { C1GradientAscentParameterDefaultDTO } from "aethon-arion-c1/dist/constants/c1.model.constants";
import { SimSetDTO } from "aethon-arion-pipeline";
import { ModelService } from "src/app/analyst/services/model.service";

@Component({
    selector: "arion-sim-set-create",
    templateUrl: "./sim-set-create.component.html",
    styleUrls: ["./sim-set-create.component.scss"]
})
export class SimSetCreateComponent implements OnInit {
    @Input() simSet!: SimSetDTO;
    @Output() simSetChange: EventEmitter<SimSetDTO> = new EventEmitter<SimSetDTO>();
    models!: string[];

    constructor(private modelService: ModelService) {}

    ngOnInit(): void {
        this.models = this.modelService.getModels().map((model) => model.name);
        this.simSet.modelName = C1ModelName;
        this.simSet.optimiserName = C1OptimiserNames.GRADIENT_ASCENT
        this.simSet.optimiserParams = C1GradientAscentParameterDefaultDTO
    }
}
