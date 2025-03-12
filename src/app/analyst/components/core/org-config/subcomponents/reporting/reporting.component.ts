import { Component, Input, OnInit } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { ModelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-reporting",
    templateUrl: "./reporting.component.html",
    styleUrls: ["./reporting.component.scss"]
})
export class ReportingComponent implements OnInit {
    @Input() orgConfig!: OrgConfigDTO;
    modelNames = ModelNames;
    modelName: string | undefined;

    ngOnInit() {
        if(!this.orgConfig) throw new Error("OrgConfigDTO is required");
        this.modelName = this.orgConfig.configuratorParams.modelName;
        if(!this.modelName) throw new Error("Model name is required");
    }
}
