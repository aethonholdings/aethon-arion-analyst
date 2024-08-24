import { AgentSetTensorsDTO } from "aethon-arion-pipeline";

export type Summary = SummaryElement[];

export interface AgentSetReportData {
    agentSetTensorsDTO: AgentSetTensorsDTO;
    gains: {
        influence: number;
        judgment: number;
        incentive: number;
    };
    variableNames: {
        plant: string[];
        reporting: string[];
    };
}

export interface ModelVariableNames {
    agentStatesArray: string[];
    plantStatesArray: string[];
    reportingVariablesArray: string[];
}

export interface SummaryElement {
    key: string;
    value: string | number | Date | undefined;
    class?: string;
}

export interface Pagination<T> {
    data: [T];
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
        sortBy?: string[][];
        search?: string;
        filter?: any;
    };
    links: {
        first: string;
        previous: string;
        current: string;
        next: string;
        last: string;
    };
}
