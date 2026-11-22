import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { ConfiguratorParamData, ConfiguratorParamsDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-configurator-params",
    templateUrl: "./configurator-params.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
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
