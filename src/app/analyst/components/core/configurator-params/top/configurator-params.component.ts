import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-configurator-params",
    templateUrl: "./configurator-params.component.html",
    styleUrls: ["./configurator-params.component.scss"]
})
export class ConfiguratorParamsComponent<T extends ConfiguratorParamData> {
    @Input() dataArray!: ConfiguratorParamsDTO<T>[];
    @Input() dataInstance!: ConfiguratorParamsDTO<T>;
    @Input() view!: string;
    @Output() dataArrayChange: EventEmitter<ConfiguratorParamsDTO<T>[]> = new EventEmitter<
        ConfiguratorParamsDTO<T>[]
    >();
    @Output() dataInstanceChange: EventEmitter<ConfiguratorParamsDTO<T>> = new EventEmitter<ConfiguratorParamsDTO<T>>();
    @Output() selected = new EventEmitter<number>();

    views = Views;
}
