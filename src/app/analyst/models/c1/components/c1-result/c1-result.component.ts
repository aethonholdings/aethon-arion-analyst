import { Component, Input } from "@angular/core";
import { C1PlantStateVariablesIndex, C1Presentation, C1ReportingVariablesIndex } from "aethon-arion-c1";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-result",
    templateUrl: "./c1-result.component.html",
    styleUrls: ["./c1-result.component.scss"]
})
export class C1ResultComponent {
    @Input() resultDTO: ResultDTO | undefined;
    reportingVariablesIndex = C1ReportingVariablesIndex;
    plantStateVariablesIndex = C1PlantStateVariablesIndex;
    presentation: C1Presentation = {} as C1Presentation;

    constructor() {}

    ngOnInit(): void {
        if (this.resultDTO) this.presentation = new C1Presentation(this.resultDTO);
    }
}
