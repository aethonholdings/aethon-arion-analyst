import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    standalone: false,
    selector: "arion-result-pivot",
    templateUrl: "./result-pivot.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./result-pivot.component.scss"]
})
export class ResultPivotComponent {
    @Input() results!: ResultDTO[];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
}
