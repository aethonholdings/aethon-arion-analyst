import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import {
    Domain,
    GradientAscentOptimiserData,
    OptimiserStateDTO,
    SimSetDTO
} from "aethon-arion-pipeline";

const flatten = require("flat");

@Component({
    selector: "arion-c1-optimiser-state-transitions",
    templateUrl: "./c1-optimiser-state-transitions.component.html",
    styleUrls: ["./c1-optimiser-state-transitions.component.scss"]
})
export class C1OptimiserStateTransitionsComponent implements OnInit {
    @Input() simSet!: SimSetDTO;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    states!: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>[];
    domains!: string[];
    x!: any[];

    ngOnInit(): void {
        if (this.simSet.optimiserStates) this.states = this.simSet.optimiserStates;
        if (this.simSet.optimiserParams.parameterSpace)
            this.domains = this.simSet.optimiserParams.parameterSpace
                .filter((param: { id: string; domain: Domain }) => param.domain.optimise)
                .map((param: { id: string; domain: Domain }) => param.id);
        if (this.simSet.optimiserStates) {
            this.x = this.simSet.optimiserStates
                .map((state: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>) => {
                    return state.optimiserData.dataPoints;
                })
                .map((dataPoints) => {
                    return dataPoints.filter((dataPoint) => dataPoint.id === "x")[0];
                })
                .map((dataPoint) => {
                    dataPoint.data.inputs.data.gains.influence =
                        Math.round(1000 * dataPoint.data.inputs.data.gains.influence) / 1000;
                    dataPoint.data.inputs.data.gains.judgment =
                        Math.round(1000 * dataPoint.data.inputs.data.gains.judgment) / 1000;
                    dataPoint.data.inputs.data.gains.incentive =
                        Math.round(100000 * dataPoint.data.inputs.data.gains.incentive) / 100000;
                    return flatten(dataPoint.data.inputs.data);
                });
        }
    }
}
