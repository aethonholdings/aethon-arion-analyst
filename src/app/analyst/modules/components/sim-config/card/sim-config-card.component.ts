import { Component, Input } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-config-card",
    templateUrl: "./sim-config-card.component.html",
    styleUrls: ["./sim-config-card.component.scss"]
})
export class SimConfigCardComponent {
    @Input() simConfig: SimConfigDTO | undefined;
}
