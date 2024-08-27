import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-board",
    templateUrl: "./board.component.html",
    styleUrls: ["./board.component.scss"]
})
export class BoardComponent {
    @Input() orgConfig: OrgConfigDTO = {} as OrgConfigDTO;
}
