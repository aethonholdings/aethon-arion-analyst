import { Component, EventEmitter, Input, Output } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-org-config",
    templateUrl: "./org-config.component.html",
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
