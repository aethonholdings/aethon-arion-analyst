import { Injectable } from "@angular/core";
import { Model } from "aethon-arion-pipeline";
import { C1 } from "aethon-arion-c1";

@Injectable({
    providedIn: "root"
})
export class ModelService {
    private _models: Model[] = [C1];

    constructor() {}

    getModels(): Model[] {
        return this._models;
    }
}
