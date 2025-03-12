import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-index",
    templateUrl: "./result-index.component.html",
    styleUrls: ["./result-index.component.scss"]
})
export class ResultIndexComponent {
    @Input() results!: ResultDTO[];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
}
