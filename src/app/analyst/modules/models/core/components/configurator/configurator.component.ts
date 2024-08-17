import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamsDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-configurator",
    templateUrl: "./configurator.component.html",
    styleUrls: ["./configurator.component.scss"]
})
export class ConfiguratorComponent {
    @Input() configuratorParams: ConfiguratorParamsDTO | undefined;
    @Output() configuratorParamsChange: EventEmitter<ConfiguratorParamsDTO> = new EventEmitter<ConfiguratorParamsDTO>();
}
