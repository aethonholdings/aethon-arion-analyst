import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrgConfigSummaryDTO } from 'src/app/analyst/services/analyst.service';

@Component({
    selector: 'arion-org-config-index',
    templateUrl: './org-config-index.component.html',
    styleUrls: ['./org-config-index.component.scss']
})
export class OrgConfigIndexComponent {
    @Input() summary: OrgConfigSummaryDTO[] = [];
    @Input() selectedAgentCount: number | null = null;
    @Output() agentCountClick = new EventEmitter<number>();
}
