import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { OrgConfigTableRow, SimConfigClickEvent } from "../views/table/org-config-table.component";

@Component({
    standalone: false,
    selector: "arion-org-config-running",
    templateUrl: "./org-config-running.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./org-config-running.component.scss"]
})
export class OrgConfigRunningComponent {
    @Input() rows: OrgConfigTableRow[] = [];
    @Output() orgConfigClick = new EventEmitter<number>();
    @Output() simConfigClick = new EventEmitter<SimConfigClickEvent>();
}
