import { Component, Input } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-configurator-card",
    templateUrl: "./configurator-card.component.html",
    styleUrls: ["./configurator-card.component.scss"]
})
export class ConfiguratorCardComponent<T extends ConfiguratorParamData> {
    @Input() configuratorParams: ConfiguratorParamsDTO<T> = {} as ConfiguratorParamsDTO<T>;
}
