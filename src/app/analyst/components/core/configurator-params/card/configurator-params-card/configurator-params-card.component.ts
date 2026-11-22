import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";
import { ModelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-configurator-params-card",
    templateUrl: "./configurator-params-card.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./configurator-params-card.component.scss"]
})
export class ConfiguratorParamsCardComponent<T extends ConfiguratorParamData> {
    @Input() configuratorParamsDTO!: ConfiguratorParamsDTO<T>;
    modelNames = ModelNames;
}
