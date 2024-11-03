import { Component, Input } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-config",
    templateUrl: "./sim-config.component.html",
    styleUrls: ["./sim-config.component.scss"]
})
export class SimConfigComponent {
    @Input() simConfig: SimConfigDTO = {} as SimConfigDTO;
}
