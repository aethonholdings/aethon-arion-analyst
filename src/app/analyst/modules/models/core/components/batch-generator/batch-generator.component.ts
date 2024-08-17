import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamsDTO, SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-batch-generator",
    templateUrl: "./batch-generator.component.html",
    styleUrls: ["./batch-generator.component.scss"]
})
export class BatchGeneratorComponent {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
    @Output() batchGenerated = new EventEmitter<ConfiguratorParamsDTO[]>();

    constructor() {}

    generate(batchGenerated: ConfiguratorParamsDTO[]) {
        this.batchGenerated.emit(batchGenerated);
    }
}
