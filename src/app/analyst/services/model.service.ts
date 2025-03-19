import { Injectable } from "@angular/core";
import { AgentSetReportData } from "../types/analyst.types";
import { C1, C1ModelName } from "aethon-arion-c1";
import { Model, OrgConfigDTO } from "aethon-arion-pipeline";

@Injectable({
    providedIn: "root"
})
export class ModelService {
    private _models: Model<any, any>[] = [C1];

    constructor() {}

    getModels(): Model<any, any>[] {
        return this._models;
    }

    getAgentSetReportData(orgConfig: OrgConfigDTO): AgentSetReportData {
        const agentSetReportData: AgentSetReportData = {} as AgentSetReportData;
        agentSetReportData.agentSetTensorsDTO = orgConfig.agentSet;
        switch (orgConfig.configuratorParams.modelName) {
            case C1ModelName: {
                const index = C1.index;
                if (index.plant?.variableNames && index.reporting?.variableNames) {
                    agentSetReportData.gains = orgConfig.configuratorParams.data.gains;
                    agentSetReportData.variableNames = {
                        plant: index.plant.variableNames,
                        reporting: index.reporting.variableNames
                    };
                } else {
                    throw new Error("Incomplete C1 model index");
                }
                break;
            }
        }
        return agentSetReportData;
    }
}
