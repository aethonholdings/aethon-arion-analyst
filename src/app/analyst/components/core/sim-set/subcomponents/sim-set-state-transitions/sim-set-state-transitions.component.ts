import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { C1ModelName } from "aethon-arion-c1";
import { SimSetDTO } from "aethon-arion-pipeline";

@Component({
    standalone: false,
    selector: "arion-sim-set-state-transition",
    templateUrl: "./sim-set-state-transitions.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./sim-set-state-transitions.component.scss"]
})
export class SimSetStateTransitionsComponent {
    @Input() simSet!: SimSetDTO;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    C1ModelName = C1ModelName;

    onSelect(optimiserStateId: number) {
        this.selected.emit(optimiserStateId);
    }
}
