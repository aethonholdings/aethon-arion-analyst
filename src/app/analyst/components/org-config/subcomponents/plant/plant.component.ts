import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { modelNames } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-plant",
    templateUrl: "./plant.component.html",
    styleUrls: ["./plant.component.scss"]
})
export class PlantComponent {
    @Input() orgConfig!: OrgConfigDTO;
    modelNames = modelNames;
}
