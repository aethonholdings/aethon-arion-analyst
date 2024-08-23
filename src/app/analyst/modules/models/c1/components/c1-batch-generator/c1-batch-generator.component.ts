import { Component, EventEmitter, Input, Output } from "@angular/core";
import { C1ConfiguratorParamsDTO } from "aethon-arion-c1";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystC1Service } from "../../services/analyst-c1.service";
import { BatchParams } from "../../interfaces/analyst-c1.interfaces";
import { batchParamsInit } from "../../constants/analyst-c1.constants";

@Component({
    selector: "arion-c1-batch-generator",
    templateUrl: "./c1-batch-generator.component.html",
    styleUrls: ["./c1-batch-generator.component.scss"]
})
export class C1BatchGeneratorComponent {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
    @Output() batchGenerated = new EventEmitter<C1ConfiguratorParamsDTO[]>();

    batchParams: BatchParams = batchParamsInit;

    constructor(private analystC1Service: AnalystC1Service) {}

    generate() {
        if (
            this.batchParams.agentCount.layers.max >= this.batchParams.agentCount.layers.min &&
            this.batchParams.agentCount.spans.max >= this.batchParams.agentCount.spans.min
        ) {
            this.batchGenerated.emit(this.analystC1Service.generateConfigParamsBatch(this.simSet, this.batchParams));
            // console.log(this.analystC1Service.generateConfigParamsBatch(this.simSet, this.batchParams));
        } else {
            throw new Error("Max values must be greater than or equal to min values");
        }
    }
}
