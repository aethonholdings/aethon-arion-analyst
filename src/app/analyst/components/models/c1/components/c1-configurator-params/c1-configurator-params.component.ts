import { Component, Input, OnInit } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-configurator-params",
    templateUrl: "./c1-configurator-params.component.html",
    styleUrls: ["./c1-configurator-params.component.scss"]
})
export class C1ConfiguratorParamsComponent<T extends ConfiguratorParamData> implements OnInit {
    @Input() configuratorParamsDTO!: ConfiguratorParamsDTO<T>;
    c1ConfiguratorParamsDTO!: ConfiguratorParamsDTO<C1ConfiguratorParamData>;
    agentCount!: number;

    ngOnInit(): void {
        if (this.configuratorParamsDTO) {
            this.c1ConfiguratorParamsDTO = this.configuratorParamsDTO as ConfiguratorParamsDTO<C1ConfiguratorParamData>;

            this.c1ConfiguratorParamsDTO.data.spans > 1
                ? (this.agentCount =
                      (this.c1ConfiguratorParamsDTO.data.spans ** this.c1ConfiguratorParamsDTO.data.layers - 1) /
                      (this.c1ConfiguratorParamsDTO.data.spans - 1))
                : (this.agentCount = this.c1ConfiguratorParamsDTO.data.layers);
        } else {
            throw new Error("ConfiguratorParamsDTO is not defined");
        }
    }
}
