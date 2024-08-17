import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-org-config",
    templateUrl: "./org-config.component.html",
    styleUrls: ["./org-config.component.scss"]
})
export class OrgConfigComponent {
    @Input() orgConfig: OrgConfigDTO = {} as OrgConfigDTO;
}
