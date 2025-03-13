import { Component, Input } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";
import { ModelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-configurator-params-card",
    templateUrl: "./configurator-params-card.component.html",
    styleUrls: ["./configurator-params-card.component.scss"]
})
export class ConfiguratorParamsCardComponent<T extends ConfiguratorParamData> {
    @Input() configuratorParamsDTO!: ConfiguratorParamsDTO<T>;
    modelNames = ModelNames;
}
