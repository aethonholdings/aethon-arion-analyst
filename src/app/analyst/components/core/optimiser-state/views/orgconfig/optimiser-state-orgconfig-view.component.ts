import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OptimiserStateDTO, ConfiguratorParamData, DataPoint } from "aethon-arion-pipeline";

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

        // Build a map of all orgConfigs
        const orgConfigMap = new Map<number, any>();
        for (const convergenceTest of convergenceTests) {
            if (convergenceTest.simConfigs) {
                for (const simConfig of convergenceTest.simConfigs) {
                    if (simConfig.orgConfig) {
                        orgConfigMap.set(simConfig.orgConfig.id, {
                            id: simConfig.orgConfig.id,
                            params: simConfig.orgConfig.configuratorParams,
                            avgPerformance: simConfig.avgPerformance
                        });
                    }
                }
            }
        }

        const allOrgConfigs = Array.from(orgConfigMap.values());

        // Process each dataPoint
        for (const dataPoint of dataPoints) {
            const column = this.createColumnFromDataPoint(dataPoint, allOrgConfigs);

            if (dataPoint.id === 'x') {
                this.baselineColumn = column;
            } else {
                this.deltaColumns.push(column);
            }
        }
    }

    createColumnFromDataPoint(dataPoint: any, allOrgConfigs: any[]): DimensionColumn {
        const parameterPath = this.extractParameterPath(dataPoint);
        const parameterValue = dataPoint.data?.outputs?.configuratorParameterValue;

        // Find matching orgConfigs based on parameter values
        const matchingOrgConfigs = this.findMatchingOrgConfigs(dataPoint, allOrgConfigs);

        // Calculate performance statistics
        const performances = matchingOrgConfigs
            .map(oc => oc.avgPerformance)
            .filter(p => p !== null && p !== undefined);

        const avgPerformance = performances.length > 0
            ? performances.reduce((sum, p) => sum + p, 0) / performances.length
            : 0;

        const stdDevPerformance = this.calculateStdDev(performances);

        return {
            id: dataPoint.id,
            parameterPath,
            parameterValue,
            avgPerformance,
            stdDevPerformance,
            orgConfigs: matchingOrgConfigs.map(oc => ({
                id: oc.id,
                hash: this.getOrgConfigHash(oc.params),
                avgPerformance: oc.avgPerformance
            })),
            expanded: false
        };
    }

    extractParameterPath(dataPoint: any): string {
        const configuratorName = dataPoint.data?.inputs?.configuratorName;
        if (configuratorName) {
            return configuratorName;
        }
        return 'Unknown';
    }

    findMatchingOrgConfigs(dataPoint: any, allOrgConfigs: any[]): any[] {
        if (allOrgConfigs.length === 0) {
            return [];
        }

        // For baseline (x), we need to find the baseline orgConfig(s)
        // Compare dataPoint params to find matching orgConfigs
        const dataPointParams = dataPoint.data?.inputs?.data;
        if (!dataPointParams) {
            return [];
        }

        // Match orgConfigs whose configuratorParams.data closely matches the dataPoint's inputs.data
        const matchingOrgConfigs = allOrgConfigs.filter(oc => {
            const orgConfigData = oc.params?.data;
            if (!orgConfigData) {
                return false;
            }

            // Calculate similarity score between dataPoint params and orgConfig params
            const similarity = this.calculateParamsSimilarity(dataPointParams, orgConfigData);

            // For baseline (x), look for very close matches (>95% similarity)
            // For delta points, look for matches to that specific variation (>90% similarity)
            const threshold = dataPoint.id === 'x' ? 0.95 : 0.90;

            return similarity >= threshold;
        });

        // If no exact matches found for delta points, try to find by parameter value
        if (matchingOrgConfigs.length === 0 && dataPoint.id !== 'x') {
            const paramValue = dataPoint.data?.outputs?.configuratorParameterValue;
            if (paramValue !== undefined) {
                // Try to find orgConfigs with this specific parameter value
                return this.findOrgConfigsByParamValue(dataPointParams, paramValue, allOrgConfigs);
            }
        }

        return matchingOrgConfigs;
    }

    calculateParamsSimilarity(params1: any, params2: any): number {
        // Compare two parameter objects and return similarity score (0-1)
        const keys1 = this.getAllKeys(params1);
        const keys2 = this.getAllKeys(params2);
        const allKeys = new Set([...keys1, ...keys2]);

        let matches = 0;
        let total = 0;

        for (const key of allKeys) {
            const val1 = this.getNestedValue(params1, key);
            const val2 = this.getNestedValue(params2, key);

            total++;
            if (JSON.stringify(val1) === JSON.stringify(val2)) {
                matches++;
            }
        }

        return total > 0 ? matches / total : 0;
    }

    getAllKeys(obj: any, prefix: string = ''): string[] {
        const keys: string[] = [];

        if (typeof obj !== 'object' || obj === null) {
            return keys;
        }

        for (const key of Object.keys(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                keys.push(...this.getAllKeys(value, fullKey));
            } else {
                keys.push(fullKey);
            }
        }

        return keys;
    }

    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    findOrgConfigsByParamValue(dataPointParams: any, paramValue: any, allOrgConfigs: any[]): any[] {
        // Try to find the parameter that has the specified value
        const paramPath = this.findParameterPathWithValue(dataPointParams, paramValue);

        if (!paramPath) {
            return [];
        }

        // Find orgConfigs where this parameter has the same value
        return allOrgConfigs.filter(oc => {
            const orgConfigValue = this.getNestedValue(oc.params?.data, paramPath);
            return Math.abs(orgConfigValue - paramValue) < 0.0001; // Float comparison with tolerance
        });
    }

    findParameterPathWithValue(obj: any, value: any, prefix: string = ''): string | null {
        if (typeof obj !== 'object' || obj === null) {
            return null;
        }

        for (const key of Object.keys(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const val = obj[key];

            if (typeof val === 'number' && Math.abs(val - value) < 0.0001) {
                return fullKey;
            }

            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                const found = this.findParameterPathWithValue(val, value, fullKey);
                if (found) {
                    return found;
                }
            }
        }

        return null;
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

    getOrgConfigHash(params: any): string {
        if (!params) {
            return '00000000';
        }
        const seen = new WeakSet();
        const jsonStr = JSON.stringify(params, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        });
        return this.hashString(jsonStr);
    }

    hashString(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    toggleColumn(column: DimensionColumn) {
        column.expanded = !column.expanded;
    }

    navigateToOrgConfig(orgConfigId: number, event: Event) {
        event.stopPropagation();
        this.router.navigate(['/org-config', orgConfigId]);
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
