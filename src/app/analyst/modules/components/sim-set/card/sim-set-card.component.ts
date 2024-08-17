import { Component, Input } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-set-card",
    templateUrl: "./sim-set-card.component.html",
    styleUrls: ["./sim-set-card.component.scss"]
})
export class SimSetCardComponent {
    @Input() simSet: SimSetDTO | undefined;
}
