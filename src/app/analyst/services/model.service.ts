import { Injectable } from "@angular/core";
import { Model, OrgConfigDTO } from "aethon-arion-pipeline";
import { C1 } from "aethon-arion-c1";
import { AgentSetReportData } from "../types/analyst.types";
import { C1ModelName, C1PlantStateVariablesArray, C1ReportingVariablesArray } from "aethon-arion-c1/dist/constants/c1.model.constants";

@Injectable({
    providedIn: "root"
})
export class ModelService {
    private _models: Model[] = [C1];

    constructor() {}

    getModels(): Model[] {
        return this._models;
    }

    getAgentSetReportData(orgConfig: OrgConfigDTO): AgentSetReportData {
      const agentSetReportData: AgentSetReportData = {} as AgentSetReportData;
      agentSetReportData.agentSetTensorsDTO = orgConfig.agentSet;
      switch (orgConfig.configuratorParams.modelName) {
          case C1ModelName: {
              agentSetReportData.gains = orgConfig.configuratorParams.data.gains;
              agentSetReportData.variableNames = {
                  plant: C1PlantStateVariablesArray,
                  reporting: C1ReportingVariablesArray
              };
              break;
          }
      }
      return agentSetReportData;
  }
}
