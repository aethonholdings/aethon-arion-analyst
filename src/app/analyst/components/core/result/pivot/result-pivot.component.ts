import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-pivot",
    templateUrl: "./result-pivot.component.html",
    styleUrls: ["./result-pivot.component.scss"]
})
export class ResultPivotComponent {
    @Input() results!: ResultDTO[];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
}
