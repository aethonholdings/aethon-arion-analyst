import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-result",
    templateUrl: "./result.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./result.component.scss"]
})
export class ResultComponent {
    @Input() dataArray!: ResultDTO[];
    @Input() dataInstance!: ResultDTO;
    @Input() view!: string;
    @Output() dataArrayChange = new EventEmitter<ResultDTO[]>();
    @Output() dataInstanceChange = new EventEmitter<ResultDTO>();
    @Output() selected = new EventEmitter<number>();

    views = Views;
}
