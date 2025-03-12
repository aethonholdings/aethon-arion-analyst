import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-index",
    templateUrl: "./result-index.component.html",
    styleUrls: ["./result-index.component.scss"]
})
export class ResultIndexComponent implements OnInit {
    @Input() results!: ResultDTO[];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    ngOnInit() {
        this.results = this.results.sort((a, b) => {
            if (a.performance && b.performance) {
                return b.performance - a.performance;
            } else {
                return 0;
            }
        });
    }
}
