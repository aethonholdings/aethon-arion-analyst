import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";

@Component({
    standalone: false,
    selector: "arion-sim-config-card",
    templateUrl: "./sim-config-card.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./sim-config-card.component.scss"]
})
export class SimConfigCardComponent {
    @Input() simConfig!: SimConfigDTO;
}
