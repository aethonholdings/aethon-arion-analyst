import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { modelNames } from '../../../../../constants/analyst.constants';

@Component({
    selector: "arion-board",
    templateUrl: "./board.component.html",
    styleUrls: ["./board.component.scss"]
})
export class BoardComponent {
    @Input() orgConfig!: OrgConfigDTO;
    modelNames = modelNames;
}
