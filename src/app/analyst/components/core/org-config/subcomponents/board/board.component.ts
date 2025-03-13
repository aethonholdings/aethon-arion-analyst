import { Component, Input, OnInit } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { ModelNames } from "../../../../../constants/analyst.constants";

@Component({
    selector: "arion-board",
    templateUrl: "./board.component.html",
    styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
    @Input() orgConfig!: OrgConfigDTO;
    modelNames = ModelNames;
    modelName: string | undefined;

    ngOnInit(): void {
        if (!this.orgConfig) throw new Error("Org config is not defined");
        this.modelName = this.orgConfig.configuratorParams.modelName;
        if (!this.modelName) throw new Error("Model name is not defined");
    }
}
