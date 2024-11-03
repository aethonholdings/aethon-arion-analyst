import { Injectable } from "@angular/core";
import { C1ConfiguratorParamsDTO } from "aethon-arion-c1";
import { BatchParams } from "../interfaces/analyst-c1.interfaces";

@Injectable({
    providedIn: "root"
})
export class AnalystC1Service {
    constructor() {}

    generateConfigParamsBatch(batchParams: BatchParams): C1ConfiguratorParamsDTO[] {
        const actionStateProbability: number = 0.85;

        const configParamsArray: C1ConfiguratorParamsDTO[] = [];
        for (let i = 0; i < batchParams.loops; i++) {
            for (let spans = batchParams.agentCount.spans.min; spans <= batchParams.agentCount.spans.max; spans++) {
                for (
                    let layers = batchParams.agentCount.layers.min;
                    layers <= batchParams.agentCount.layers.max;
                    layers++
                ) {
                    for (const influenceKey of Object.keys(batchParams.initialisers.influence.matrix)) {
                        if ((batchParams.initialisers.influence.matrix as any)[influenceKey]) {
                            for (const judgmentKey of Object.keys(batchParams.initialisers.judgment.matrix)) {
                                if ((batchParams.initialisers.judgment.matrix as any)[judgmentKey]) {
                                    for (const incentiveKey of Object.keys(batchParams.initialisers.incentive.matrix)) {
                                        if ((batchParams.initialisers.incentive.matrix as any)[incentiveKey]) {
                                            for (const graphKey of Object.keys(batchParams.graph)) {
                                                if ((batchParams.graph as any)[graphKey]) {
                                                    for (const influenceGain of batchParams.initialisers.influence
                                                        .gains) {
                                                        for (const judgmentGain of batchParams.initialisers.judgment
                                                            .gains) {
                                                            for (const incentiveGain of batchParams.initialisers
                                                                .incentive.gains) {
                                                                const configuratorParams: C1ConfiguratorParamsDTO = {
                                                                    configuratorName: "C1Configurator",
                                                                    data: {
                                                                        spans: spans,
                                                                        layers: layers,
                                                                        gains: {
                                                                            influence: influenceGain,
                                                                            judgment: judgmentGain,
                                                                            incentive: incentiveGain
                                                                        },
                                                                        graph: graphKey,
                                                                        actionStateProbability: actionStateProbability,
                                                                        matrixInit: {
                                                                            influence: influenceKey,
                                                                            judgment: judgmentKey,
                                                                            incentive: incentiveKey
                                                                        },
                                                                        reporting: {
                                                                            unitPayroll: 1,
                                                                            unitPrice: 1
                                                                        },
                                                                        board: {
                                                                            controlStep: batchParams.controlStep
                                                                        }
                                                                    }
                                                                } as C1ConfiguratorParamsDTO;
                                                                configParamsArray.push(configuratorParams);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return configParamsArray;
    }
}
