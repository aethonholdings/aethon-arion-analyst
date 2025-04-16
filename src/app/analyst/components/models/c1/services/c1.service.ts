import { Injectable } from "@angular/core";
import { C1, C1ConfiguratorParamData, C1GraphTypes, C1MatrixInitTypes, C1OptimiserNames } from "aethon-arion-c1";
import { DomainTypes, GradientAscentParameters, Model, Optimiser, OptimiserParameters } from "aethon-arion-pipeline";

@Injectable({
    providedIn: "root"
})
export class C1Service {
    private _model: Model = C1 as unknown as Model;
    private _c1GradientAscentDefaultOptimiserParams: GradientAscentParameters = {
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

    constructor() {}

    getModel(): Model {
        return this._model;
    }

    getOptimisers(): {
        name: string;
        defaults: OptimiserParameters;
    }[] {
        return [
            {
                name: this._model.getOptimiser(C1OptimiserNames.GRADIENT_ASCENT).name,
                defaults: this._c1GradientAscentDefaultOptimiserParams
            }
        ];
    }
}
