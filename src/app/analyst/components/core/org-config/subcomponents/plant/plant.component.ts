import { Component, Input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { ModelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-plant",
    templateUrl: "./plant.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./plant.component.scss"]
})
export class PlantComponent implements OnInit {
    @Input() orgConfig!: OrgConfigDTO;
    modelNames = ModelNames;
    modelName: string | undefined;

    ngOnInit(): void {
        if (!this.orgConfig) throw new Error("Org config is not defined");
        this.modelName = this.orgConfig.configuratorParams.modelName;
        if (!this.modelName) throw new Error("Model name is not defined");
    }
}
