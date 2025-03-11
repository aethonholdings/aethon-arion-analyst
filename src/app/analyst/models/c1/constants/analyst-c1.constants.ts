import { BatchParams } from "../interfaces/analyst-c1.interfaces";

export const batchParamsInit: BatchParams = {
    loops: 1,
    agentCount: {
        spans: {
            min: 1,
            max: 9
        },
        layers: {
            min: 1,
            max: 3
        }
    },
    graph: {
        teams: true,
        topDown: false
    },
    controlStep: true,
    initialisers: {
        influence: {
            matrix: {
                null: true,
                random: false,
                hybrid: true,
                purposeful: true
            },
            gains: [0.000001]
        },
        judgment: {
            matrix: {
                null: true,
                random: true,
                hybrid: true,
                purposeful: false
            },
            gains: [0.00001]
        },
        incentive: {
            matrix: {
                null: true,
                random: false,
                hybrid: true,
                purposeful: true
            },
            gains: [0.00000001]
        }
    }
};
