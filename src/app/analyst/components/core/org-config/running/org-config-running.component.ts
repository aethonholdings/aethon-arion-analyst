import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrgConfigTableRow, SimConfigClickEvent } from '../views/table/org-config-table.component';

@Component({
    selector: 'arion-org-config-running',
    templateUrl: './org-config-running.component.html',
    styleUrls: ['./org-config-running.component.scss']
})
export class OrgConfigRunningComponent {
    @Input() rows: OrgConfigTableRow[] = [];
    @Output() orgConfigClick = new EventEmitter<number>();
    @Output() simConfigClick = new EventEmitter<SimConfigClickEvent>();
}
