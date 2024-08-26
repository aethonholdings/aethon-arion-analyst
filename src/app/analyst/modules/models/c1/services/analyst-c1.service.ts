import { Injectable } from "@angular/core";
import { C1ConfiguratorParamsDTO, C1ResultSet } from "aethon-arion-c1";
import { SimSetDTO } from "aethon-arion-pipeline";
import { BatchParams } from "../interfaces/analyst-c1.interfaces";

@Injectable({
    providedIn: "root"
})
export class AnalystC1Service {
    constructor() {}

    generateConfigParamsBatch(simSet: SimSetDTO, batchParams: BatchParams): C1ConfiguratorParamsDTO[] {
        let actionStateProbability: number = 0.85;

        const configParamsArray: C1ConfiguratorParamsDTO[] = [];
        for (let i = 0; i < batchParams.loops; i++) {
            for (let spans = batchParams.agentCount.spans.min; spans <= batchParams.agentCount.spans.max; spans++) {
                for (
                    let layers = batchParams.agentCount.layers.min;
                    layers <= batchParams.agentCount.layers.max;
                    layers++
                ) {
                    for (let influenceKey of Object.keys(batchParams.initialisers.influence.matrix)) {
                        if ((batchParams.initialisers.influence.matrix as any)[influenceKey]) {
                            for (let judgmentKey of Object.keys(batchParams.initialisers.judgment.matrix)) {
                                if ((batchParams.initialisers.judgment.matrix as any)[judgmentKey]) {
                                    for (let incentiveKey of Object.keys(batchParams.initialisers.incentive.matrix)) {
                                        if ((batchParams.initialisers.incentive.matrix as any)[incentiveKey]) {
                                            for (let graphKey of Object.keys(batchParams.graph)) {
                                                if ((batchParams.graph as any)[graphKey]) {
                                                    for (let influenceGain of batchParams.initialisers.influence
                                                        .gains) {
                                                        for (let judgmentGain of batchParams.initialisers.judgment
                                                            .gains) {
                                                            for (let incentiveGain of batchParams.initialisers.incentive
                                                                .gains) {
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
