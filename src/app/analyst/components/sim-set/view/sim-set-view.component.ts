import { Component, Input } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-set-view",
    templateUrl: "./sim-set-view.component.html",
    styleUrls: ["./sim-set-view.component.scss"]
})
export class SimSetViewComponent {
    @Input() simSet: SimSetDTO = {} as SimSetDTO;
}
