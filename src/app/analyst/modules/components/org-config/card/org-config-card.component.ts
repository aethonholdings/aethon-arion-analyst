import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-org-config-card",
    templateUrl: "./org-config-card.component.html",
    styleUrls: ["./org-config-card.component.scss"]
})
export class OrgConfigCardComponent {
    @Input() orgConfig: OrgConfigDTO = {} as OrgConfigDTO;
}
