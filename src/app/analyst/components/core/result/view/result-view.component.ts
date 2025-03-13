import { Component, Input, OnInit } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";
import { ModelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-result-view",
    templateUrl: "./result-view.component.html",
    styleUrls: ["./result-view.component.scss"]
})
export class ResultViewComponent implements OnInit {
    @Input() result!: ResultDTO;
    modelName: string | undefined;
    modelNames = ModelNames;

    ngOnInit() {
        if (!this.result) throw new Error("Result DTO is required");
        this.modelName = this.result?.simConfig?.orgConfig?.configuratorParams.modelName;
        if (!this.modelName) throw new Error("Model name is required");
    }
}
