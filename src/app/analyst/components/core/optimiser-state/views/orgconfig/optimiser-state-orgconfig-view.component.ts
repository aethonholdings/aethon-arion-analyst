import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OptimiserStateDTO, ConfiguratorParamData, DataPoint, StateType } from "aethon-arion-pipeline";

export interface DimensionColumn {
    id: string;
    parameterPath: string;
    parameterValue: any;
    avgPerformance: number;
    stdDevPerformance: number;
    orgConfigs: Array<{
        id: number;
        hash: string;
        avgPerformance: number | null;
        state: StateType;
    }>;
    expanded: boolean;
}

@Component({
    selector: "arion-optimiser-state-orgconfig-view",
    templateUrl: "./optimiser-state-orgconfig-view.component.html",
    styleUrls: ["./optimiser-state-orgconfig-view.component.scss"]
})
export class OptimiserStateOrgconfigViewComponent implements OnInit {
    @Input() optimiserState!: OptimiserStateDTO<ConfiguratorParamData>;
    baselineColumn?: DimensionColumn;
    deltaColumns: DimensionColumn[] = [];

    constructor(private router: Router) {}

    ngOnInit() {
        this.processColumns();
    }

    processColumns() {
        const dataPoints = (this.optimiserState as any).optimiserData?.dataPoints;
        if (!dataPoints || dataPoints.length === 0) {
            return;
        }

        const convergenceTests = (this.optimiserState as any).convergenceTests;
        if (!convergenceTests || convergenceTests.length === 0) {
            return;
        }

        // Build a map of configuratorParams.hash -> orgConfigs
        const hashToOrgConfigs = new Map<string, Array<{
            id: number;
            paramsHash: string;
            avgPerformance: number | null;
            state: StateType;
        }>>();

        for (const convergenceTest of convergenceTests) {
            const ctHash = convergenceTest.configuratorParams?.hash;
            if (!ctHash || !convergenceTest.simConfigs) continue;

            for (const simConfig of convergenceTest.simConfigs) {
                if (!simConfig.orgConfig) continue;

                if (!hashToOrgConfigs.has(ctHash)) {
                    hashToOrgConfigs.set(ctHash, []);
                }
                hashToOrgConfigs.get(ctHash)!.push({
                    id: simConfig.orgConfig.id,
                    paramsHash: ctHash,
                    avgPerformance: simConfig.avgPerformance,
                    state: simConfig.state || 'pending'
                });
            }
        }

        // Process each dataPoint, matching by hash
        for (const dataPoint of dataPoints) {
            const column = this.createColumnFromDataPoint(dataPoint, hashToOrgConfigs);

            if (dataPoint.id === 'x') {
                this.baselineColumn = column;
            } else {
                this.deltaColumns.push(column);
            }
        }
    }

    createColumnFromDataPoint(
        dataPoint: any,
        hashToOrgConfigs: Map<string, Array<{ id: number; paramsHash: string; avgPerformance: number | null; state: StateType }>>
    ): DimensionColumn {
        const parameterPath = dataPoint.data?.inputs?.configuratorName || 'Unknown';
        const parameterValue = dataPoint.data?.outputs?.configuratorParameterValue;
        const dataPointHash = dataPoint.data?.inputs?.hash;

        const matchingOrgConfigs = dataPointHash ? (hashToOrgConfigs.get(dataPointHash) || []) : [];

        const performances = matchingOrgConfigs
            .map(oc => oc.avgPerformance)
            .filter((p): p is number => p !== null && p !== undefined);

        const avgPerformance = performances.length > 0
            ? performances.reduce((sum, p) => sum + p, 0) / performances.length
            : 0;

        return {
            id: dataPoint.id,
            parameterPath,
            parameterValue,
            avgPerformance,
            stdDevPerformance: this.calculateStdDev(performances),
            orgConfigs: matchingOrgConfigs.map(oc => ({
                id: oc.id,
                hash: oc.paramsHash.substring(0, 8),
                avgPerformance: oc.avgPerformance,
                state: oc.state
            })),
            expanded: false
        };
    }

    calculateStdDev(values: number[]): number {
        if (values.length === 0) {
            return 0;
        }
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.sqrt(variance);
    }

    toggleColumn(column: DimensionColumn) {
        column.expanded = !column.expanded;
    }

    navigateToOrgConfig(orgConfigId: number, event: Event) {
        event.stopPropagation();
        this.router.navigate(['/org-config', orgConfigId], {
            queryParams: {
                optimiserStateId: this.optimiserState.id,
                simSetId: (this.optimiserState as any).simSet?.id
            }
        });
    }

    formatValue(value: any): string {
        if (typeof value === 'number') {
            return value.toFixed(6);
        }
        if (value === null || value === undefined) {
            return '—';
        }
        return String(value);
    }
}
