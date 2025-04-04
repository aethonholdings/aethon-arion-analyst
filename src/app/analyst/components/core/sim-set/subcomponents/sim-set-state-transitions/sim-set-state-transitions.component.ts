import { Component, EventEmitter, Input, Output } from "@angular/core";
import { C1ModelName } from "aethon-arion-c1";
import { SimSetDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-set-state-transition",
    templateUrl: "./sim-set-state-transitions.component.html",
    styleUrls: ["./sim-set-state-transitions.component.scss"]
})
export class SimSetStateTransitionsComponent {
    @Input() simSet!: SimSetDTO;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    C1ModelName = C1ModelName
}
