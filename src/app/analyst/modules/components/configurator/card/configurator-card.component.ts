import { Component, Input } from "@angular/core";
import { ConfiguratorParamsDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-configurator-card",
    templateUrl: "./configurator-card.component.html",
    styleUrls: ["./configurator-card.component.scss"]
})
export class ConfiguratorCardComponent {
    @Input() configuratorParams: ConfiguratorParamsDTO = {} as ConfiguratorParamsDTO;
}
