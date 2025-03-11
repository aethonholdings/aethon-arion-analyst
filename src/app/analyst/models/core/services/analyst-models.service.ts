import { Injectable } from "@angular/core";
import { C1Configurator } from "aethon-arion-c1";
import { Configurator, ConfiguratorParamData, SimSetDTO } from "aethon-arion-pipeline";
import {
    C1ConfiguratorParamsDTO,
    C1ConfiguratorSignature,
    C1ModelName,
    C1PlantStateVariablesArray,
    C1ReportingVariablesArray
} from "aethon-arion-c1";
import { ConfiguratorParamsDTO, OrgConfigDTO } from "aethon-arion-pipeline";
import { AgentSetReportData } from "src/app/analyst/types/analyst.types";

@Injectable({
    providedIn: "root"
})
export class AnalystModelsService<T extends ConfiguratorParamData> {
    private _configurators: Configurator[] = [new C1Configurator() as Configurator];
    private _models: string[] = ["C1", "C3"];

    constructor() {}

    getConfigurators(): Configurator[] {
        return this._configurators;
    }

    getModels(): string[] {
        return this._models;
    }

    getDefaultConfiguratorSignature(modelType: string): ConfiguratorSignatureDTO | undefined {
        switch (modelType) {
            case "C1":
                return C1ConfiguratorSignature;
            default:
                return undefined;
        }
    }

    getConfigurator(name: string): ConfiguratorSignatureDTO | undefined {
        return this._configurators.find((configurator) => {
            return configurator.name === name;
        });
    }

    getAgentSetReportData(orgConfig: OrgConfigDTO): AgentSetReportData {
        const agentSetReportData: AgentSetReportData = {} as AgentSetReportData;
        agentSetReportData.agentSetTensorsDTO = orgConfig.agentSet;
        switch (orgConfig.type) {
            case C1ModelName: {
                agentSetReportData.gains = (orgConfig.configuratorParams as C1ConfiguratorParamsDTO).data.gains;
                agentSetReportData.variableNames = {
                    plant: C1PlantStateVariablesArray,
                    reporting: C1ReportingVariablesArray
                };
                break;
            }
        }
        return agentSetReportData;
    }

    getConfiguratorDefaultParams(configurator: ConfiguratorSignatureDTO): ConfiguratorParamsDTO {
        const params: ConfiguratorParamsDTO = {} as ConfiguratorParamsDTO;
        params.configuratorName = configurator.name;
        switch (params.configuratorName) {
            case C1ConfiguratorSignature.name: {
                params.data = {
                    spans: 1,
                    layers: 1,
                    gains: {
                        influence: 0.00001,
                        judgment: 0.00001,
                        incentive: 0.00000001
                    },
                    actionStateProbability: 0.85,
                    graph: "teams",
                    matrixInit: {
                        influence: "random",
                        judgment: "random",
                        incentive: "random"
                    },
                    reporting: {
                        unitPayroll: 1,
                        unitPrice: 1
                    }
                };
                break;
            }
        }
        return params;
    }

    getSimSetPercentComplete(simSet: SimSetDTO): string {
        if (simSet.simConfigCount && simSet.completedSimConfigCount !== undefined) {
            if (simSet.simConfigCount > 0) {
                return ((simSet.completedSimConfigCount / simSet.simConfigCount) * 100).toFixed(0);
            }
        }
        return "n.a.";
    }
}
