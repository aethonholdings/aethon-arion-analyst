import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StateType } from 'aethon-arion-pipeline';

export interface OrgConfigTableRow {
    stepCount?: number;
    optimiserStateId?: number;
    orgConfigId: number;
    configHash: string;
    state: StateType;
    simConfigs: Array<{
        id: number;
        avgPerformance: number | null;
        state: StateType;
    }>;
}

export interface OrgConfigTableStep {
    stepCount: number;
    optimiserStateId: number;
    rows: OrgConfigTableRow[];
    totalSimConfigs: number;
}

export interface SimConfigClickEvent {
    simConfigId: number;
    orgConfigId: number;
    optimiserStateId?: number;
}

type SortColumn = 'orgConfigId' | 'state' | 'avgPerformance';
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'arion-org-config-table',
    templateUrl: './org-config-table.component.html',
    styleUrls: ['./org-config-table.component.scss']
})
export class OrgConfigTableComponent implements OnChanges {
    @Input() rows: OrgConfigTableRow[] = [];
    @Input() showStepColumn: boolean = false;
    @Output() orgConfigClick = new EventEmitter<number>();
    @Output() simConfigClick = new EventEmitter<SimConfigClickEvent>();
    @Output() stepClick = new EventEmitter<number>();

    performanceValues: number[] = [];
    steps: OrgConfigTableStep[] = [];
    sortedRows: OrgConfigTableRow[] = [];
    sortedSteps: OrgConfigTableStep[] = [];

    sortColumn: SortColumn = 'orgConfigId';
    sortDirection: SortDirection = 'asc';

    ngOnChanges(changes: SimpleChanges) {
        if (changes['rows']) {
            this.performanceValues = this.rows
                .flatMap(row => row.simConfigs)
                .map(sc => sc.avgPerformance)
                .filter((v): v is number => v !== null);

            if (this.showStepColumn) {
                this.buildSteps();
            }
            this.applySort();
        }
    }

    sortBy(column: SortColumn) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'desc';
        }
        this.applySort();
    }

    onSimConfigClick(simConfigId: number, orgConfig: OrgConfigTableRow) {
        this.simConfigClick.emit({
            simConfigId,
            orgConfigId: orgConfig.orgConfigId,
            optimiserStateId: orgConfig.optimiserStateId
        });
    }

    private applySort() {
        if (this.showStepColumn) {
            this.sortedSteps = this.steps.map(step => ({
                ...step,
                rows: this.sortRows([...step.rows])
            }));
        } else {
            this.sortedRows = this.sortRows([...this.rows]);
        }
    }

    private sortRows(rows: OrgConfigTableRow[]): OrgConfigTableRow[] {
        const dir = this.sortDirection === 'asc' ? 1 : -1;
        return rows.sort((a, b) => {
            switch (this.sortColumn) {
                case 'orgConfigId':
                    return (a.orgConfigId - b.orgConfigId) * dir;
                case 'state':
                    return a.state.localeCompare(b.state) * dir;
                case 'avgPerformance': {
                    const aPerf = Math.max(...a.simConfigs.map(sc => sc.avgPerformance ?? -Infinity));
                    const bPerf = Math.max(...b.simConfigs.map(sc => sc.avgPerformance ?? -Infinity));
                    if (aPerf === -Infinity && bPerf === -Infinity) return 0;
                    if (aPerf === -Infinity) return 1;
                    if (bPerf === -Infinity) return -1;
                    return (aPerf - bPerf) * dir;
                }
                default:
                    return 0;
            }
        });
    }

    private buildSteps() {
        const stepMap = new Map<number, OrgConfigTableStep>();
        for (const row of this.rows) {
            const stepCount = row.stepCount ?? 0;
            if (!stepMap.has(stepCount)) {
                stepMap.set(stepCount, {
                    stepCount,
                    optimiserStateId: row.optimiserStateId ?? 0,
                    rows: [],
                    totalSimConfigs: 0
                });
            }
            const step = stepMap.get(stepCount)!;
            step.rows.push(row);
            step.totalSimConfigs += row.simConfigs.length;
        }
        this.steps = Array.from(stepMap.values());
    }
}
