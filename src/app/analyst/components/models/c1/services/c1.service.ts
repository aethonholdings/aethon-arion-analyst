import { Injectable } from "@angular/core";
import { C1, C1ConfiguratorParamData, C1GraphTypes, C1MatrixInitTypes, C1OptimiserNames } from "aethon-arion-c1";
import { DomainTypes, GradientAscentParameters, Model, Optimiser, OptimiserParameters } from "aethon-arion-pipeline";
import { c1GradientAscentDefaultOptimiserParams } from "../constants/analyst-c1.constants";

@Injectable({
    providedIn: "root"
})
export class C1Service {
    private _model: Model = C1 as unknown as Model;
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
                defaults: c1GradientAscentDefaultOptimiserParams()
            }
        ];
    }
}
