import { Component, Input, OnInit } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";
import { Summary } from "src/app/analyst/types/analyst.types";


@Component({
    selector: "arion-result",
    templateUrl: "./result.component.html",
    styleUrls: ["./result.component.scss"]
})
export class ResultComponent implements OnInit {
    @Input() result: ResultDTO | undefined;
    summaryTitle: string | undefined;
    summary: Summary | undefined;

    ngOnInit(): void {
        this.summaryTitle = "Result ID " + this.result?.id?.toString();
        this.summary = [
            { key: "ID", value: this.result?.id, class: "width-id" },
            { key: "Performance", value: this.result?.performance },
            { key: "Run number", value: this.result?.runCount }
        ];
    }
}
