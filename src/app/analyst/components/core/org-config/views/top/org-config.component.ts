import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-org-config",
    templateUrl: "./org-config.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./org-config.component.scss"]
})
export class OrgConfigComponent {
    @Input() dataArray!: OrgConfigDTO[];
    @Input() dataInstance!: OrgConfigDTO;
    @Input() view!: string;
    @Output() dataArrayChange = new EventEmitter<OrgConfigDTO[]>();
    @Output() dataInstanceChange = new EventEmitter<OrgConfigDTO>();
    @Output() selected = new EventEmitter<number>();

    views = Views;
}
