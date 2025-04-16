import { BatchParams } from "../interfaces/analyst-c1.interfaces";
import { C1, C1GraphTypes, C1MatrixInitTypes } from "aethon-arion-c1";
import { DomainTypes, GradientAscentParameters, ModelIndexDTO } from "aethon-arion-pipeline";
import { DomainDefinition } from "src/app/analyst/widgets/domain/domain.component";

export const C1ModelIndex: ModelIndexDTO = C1.index;
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

export const C1GradientAscentDefaultOptimiserParams: GradientAscentParameters = {
    iterations: {
        learningRate: 0.001,
        tolerance: 0.001,
        max: 1000
    },
    init: { type: "random" },
    parameterSpace: [
        {
            id: "spans",
            domain: { type: DomainTypes.DISCRETE, optimise: true, min: 1, max: 5, derivativeStepSize: 1 }
        },
        {
            id: "layers",
            domain: { type: DomainTypes.DISCRETE, optimise: true, min: 1, max: 3, derivativeStepSize: 1 }
        },
        {
            id: "gains.influence",
            domain: { type: DomainTypes.CONTINUOUS, optimise: true, min: 0, max: 0.1, derivativeStepSize: 0.01 }
        },
        {
            id: "gains.judgment",
            domain: { type: DomainTypes.CONTINUOUS, optimise: true, min: 0, max: 0.1, derivativeStepSize: 0.01 }
        },
        {
            id: "gains.incentive",
            domain: {
                type: DomainTypes.CONTINUOUS,
                optimise: true,
                min: 0,
                max: 0.0001,
                derivativeStepSize: 0.00001
            }
        },
        {
            id: "actionStateProbability",
            domain: { type: DomainTypes.CONTINUOUS, optimise: false, default: 0.85 }
        },
        {
            id: "graph",
            domain: {
                type: DomainTypes.CATEGORICAL,
                optimise: false,
                default: C1GraphTypes.TOP_DOWN
            }
        },
        {
            id: "matrixInit.influence",
            domain: {
                type: DomainTypes.CATEGORICAL,
                optimise: true,
                categories: [C1MatrixInitTypes.HYBRID, C1MatrixInitTypes.PURPOSEFUL]
            }
        },
        {
            id: "matrixInit.judgment",
            domain: {
                type: DomainTypes.CATEGORICAL,
                optimise: false,
                default: C1MatrixInitTypes.RANDOM
            }
        },
        {
            id: "matrixInit.incentive",
            domain: {
                type: DomainTypes.CATEGORICAL,
                optimise: false,
                default: C1MatrixInitTypes.PURPOSEFUL
            }
        },
        {
            id: "board.controlStep",
            domain: { type: DomainTypes.BOOLEAN, optimise: false, default: false }
        },
        {
            id: "reporting.unitPayroll",
            domain: { type: DomainTypes.CONTINUOUS, optimise: false, default: 1 }
        },
        {
            id: "reporting.unitPrice",
            domain: { type: DomainTypes.CONTINUOUS, optimise: false, default: 1 }
        }
    ]
};

export const C1DomainDefinitions: DomainDefinition[] = [
    {
        id: "spans",
        domain: { type: DomainTypes.DISCRETE, min: 1, max: 5, default: 3, derivativeStepSize: 1 }
    },
    {
        id: "layers",
        domain: { type: DomainTypes.DISCRETE, min: 1, max: 3, default: 2, derivativeStepSize: 1 }
    },
    {
        id: "gains.influence",
        domain: { type: DomainTypes.CONTINUOUS, min: 0, max: 0.1, default: 0.003, derivativeStepSize: 0.0001 }
    },
    {
        id: "gains.judgment",
        domain: { type: DomainTypes.CONTINUOUS, min: 0, max: 0.1, default: 0.06, derivativeStepSize: 0.001 }
    },
    {
        id: "gains.incentive",
        domain: {
            type: DomainTypes.CONTINUOUS,
            min: 0,
            max: 0.0001,
            default: 0.0001,
            derivativeStepSize: 0.00001
        }
    },
    {
        id: "actionStateProbability",
        domain: { type: DomainTypes.CONTINUOUS, max: 1, min: 0, default: 0.85, derivativeStepSize: 0.01 }
    },
    {
        id: "graph",
        domain: {
            type: DomainTypes.CATEGORICAL,
            categories: [C1GraphTypes.TOP_DOWN, C1GraphTypes.TEAMS],
            default: C1GraphTypes.TOP_DOWN
        }
    },
    {
        id: "matrixInit.influence",
        domain: {
            type: DomainTypes.CATEGORICAL,
            categories: [
                C1MatrixInitTypes.NULL,
                C1MatrixInitTypes.RANDOM,
                C1MatrixInitTypes.HYBRID,
                C1MatrixInitTypes.PURPOSEFUL
            ],
            default: C1MatrixInitTypes.PURPOSEFUL
        }
    },
    {
        id: "matrixInit.judgment",
        domain: {
            type: DomainTypes.CATEGORICAL,

            categories: [
                C1MatrixInitTypes.NULL,
                C1MatrixInitTypes.RANDOM,
                C1MatrixInitTypes.HYBRID,
                C1MatrixInitTypes.PURPOSEFUL
            ],
            default: C1MatrixInitTypes.RANDOM
        }
    },
    {
        id: "matrixInit.incentive",
        domain: {
            type: DomainTypes.CATEGORICAL,
            categories: [
                C1MatrixInitTypes.NULL,
                C1MatrixInitTypes.RANDOM,
                C1MatrixInitTypes.HYBRID,
                C1MatrixInitTypes.PURPOSEFUL
            ],
            default: C1MatrixInitTypes.PURPOSEFUL
        }
    },
    {
        id: "board.controlStep",
        domain: { type: DomainTypes.BOOLEAN, default: false }
    },
    {
        id: "reporting.unitPayroll",
        domain: { type: DomainTypes.CONTINUOUS, max: 2, min: 1, default: 1, derivativeStepSize: 0.1 }
    },
    {
        id: "reporting.unitPrice",
        domain: { type: DomainTypes.CONTINUOUS, max: 2, min: 1, default: 1, derivativeStepSize: 0.1 }
    }
];
