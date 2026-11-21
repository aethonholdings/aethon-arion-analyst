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
            gains: [0.00003] // calibrated defaults (see C1BaseConfiguratorDefaultData)
        },
        judgment: {
            matrix: {
                null: true,
                random: true,
                hybrid: true,
                purposeful: false
            },
            gains: [0.00003]
        },
        incentive: {
            matrix: {
                null: true,
                random: false,
                hybrid: true,
                purposeful: true
            },
            gains: [0.00001] // per second, applied to the relative incentive gap
        }
    }
};

// The single source of the default C1 gradient ascent parameters (previously duplicated, with different values, in
// C1Service). Treat as read-only; use c1GradientAscentDefaultOptimiserParams() for a mutable copy.
export const C1GradientAscentDefaultOptimiserParams: Readonly<GradientAscentParameters> = {
    iterations: {
        learningRate: 0.001,
        tolerance: 0.001,
        max: 1000,
        maxStepFraction: 0.05
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
        // gain ranges span the responsive part of each response curve (see the C1 defaults: influence 3e-5,
        // judgment 3e-5, incentive 1e-5 per second); below them performance is flat, above them saturated. The
        // influence maximum respects the stability limit gain x connections (<= 2 x spans) x 300 s <= 1 for spans 5
        {
            id: "gains.influence",
            domain: { type: DomainTypes.CONTINUOUS, optimise: true, min: 0.000003, max: 0.0001, derivativeStepSize: 0.000003 }
        },
        {
            id: "gains.judgment",
            domain: { type: DomainTypes.CONTINUOUS, optimise: true, min: 0.000003, max: 0.0001, derivativeStepSize: 0.000003 }
        },
        {
            id: "gains.incentive",
            domain: { type: DomainTypes.CONTINUOUS, optimise: true, min: 0.000001, max: 0.0001, derivativeStepSize: 0.000001 }
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

/** Returns a deep, mutable copy of the default C1 gradient ascent parameters. */
export function c1GradientAscentDefaultOptimiserParams(): GradientAscentParameters {
    return JSON.parse(JSON.stringify(C1GradientAscentDefaultOptimiserParams));
}

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
        domain: { type: DomainTypes.CONTINUOUS, min: 0, max: 0.0003, default: 0.00003, derivativeStepSize: 0.000003 }
    },
    {
        id: "gains.judgment",
        domain: { type: DomainTypes.CONTINUOUS, min: 0, max: 0.001, default: 0.00003, derivativeStepSize: 0.000003 }
    },
    {
        id: "gains.incentive",
        domain: {
            type: DomainTypes.CONTINUOUS,
            min: 0,
            max: 0.0001,
            default: 0.00001,
            derivativeStepSize: 0.000001
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
