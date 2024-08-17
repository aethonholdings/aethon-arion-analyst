import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamsDTO, SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-batch-generator-view",
    templateUrl: "./batch-generator-view.component.html",
    styleUrls: ["./batch-generator-view.component.scss"]
})
export class BatchGeneratorViewComponent {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
    @Output() batchGenerated = new EventEmitter<ConfiguratorParamsDTO[]>();

    generate(batchGenerated: ConfiguratorParamsDTO[]) {
        this.batchGenerated.emit(batchGenerated);
    }
}
