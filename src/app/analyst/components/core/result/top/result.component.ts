import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-result",
    templateUrl: "./result.component.html",
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
