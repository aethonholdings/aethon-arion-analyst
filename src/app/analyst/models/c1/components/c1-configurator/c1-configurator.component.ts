import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { C1ConfiguratorParamsDTO, C1ConfiguratorSignature } from "aethon-arion-c1";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-configurator",
    templateUrl: "./c1-configurator.component.html",
    styleUrls: ["./c1-configurator.component.scss"]
})
export class C1ConfiguratorComponent<T extends ConfiguratorParamData> implements OnInit {
    @Input() configuratorParamsDTO: C1ConfiguratorParamsDTO | undefined;
    @Output() configuratorParamsDTOChange: EventEmitter<ConfiguratorParamsDTO<T>> =
        new EventEmitter<ConfiguratorParamsDTO<T>>();
    signature = C1ConfiguratorSignature;
    agentCount: number = 1;
    matrixInitOptions: string[] = ["null", "random", "purposeful", "hybrid"];
    graphInitOptions: string[] = ["top-down", "teams"];

    ngOnInit(): void {
        this.agentCountChange();
    }

    agentCountChange() {
        if (this.configuratorParamsDTO)
            this.configuratorParamsDTO.data.spans > 1
                ? (this.agentCount =
                      (this.configuratorParamsDTO.data.spans ** this.configuratorParamsDTO.data.layers - 1) /
                      (this.configuratorParamsDTO.data.spans - 1))
                : (this.agentCount = this.configuratorParamsDTO.data.layers);
    }
}
