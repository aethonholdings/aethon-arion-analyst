import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO, SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-batch-generator-view",
    templateUrl: "./batch-generator-view.component.html",
    styleUrls: ["./batch-generator-view.component.scss"]
})
export class BatchGeneratorViewComponent<T extends ConfiguratorParamData> {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
    @Output() batchGenerated = new EventEmitter<ConfiguratorParamsDTO<T>[]>();

    generate(batchGenerated: ConfiguratorParamsDTO<T>[]) {
        this.batchGenerated.emit(batchGenerated);
    }
}
