import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";

@Component({
    standalone: false,
    selector: "arion-org-config-card",
    templateUrl: "./org-config-card.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./org-config-card.component.scss"]
})
export class OrgConfigCardComponent {
    @Input() orgConfig!: OrgConfigDTO;
}
