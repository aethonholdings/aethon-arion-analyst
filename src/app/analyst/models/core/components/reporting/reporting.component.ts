import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-reporting",
    templateUrl: "./reporting.component.html",
    styleUrls: ["./reporting.component.scss"]
})
export class ReportingComponent {
    @Input() orgConfig: OrgConfigDTO = {} as OrgConfigDTO;
}
