import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import {
    ConfiguratorParamsDTO,
    DataPoint,
    Domain,
    GradientAscentOptimiserData,
    GradientAscentOutput,
    OptimiserStateDTO,
    SimSetDTO
} from "aethon-arion-pipeline";

const flatten = require("flat");

@Component({
    selector: "arion-c1-optimiser-state-transitions",
    templateUrl: "./c1-optimiser-state-transitions.component.html",
    styleUrls: ["./c1-optimiser-state-transitions.component.scss"]
})
export class C1OptimiserStateTransitionsComponent {
    @Input() simSet!: SimSetDTO;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    states!: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>[];
    domains!: string[];
    x!: any[];
    del: Array<Array<number | undefined>> = [];
    domainCount!: number;

    ngOnChanges(): void {
        if (this.simSet.optimiserStates) this.states = this.simSet.optimiserStates;
        if (this.simSet.optimiserParams.parameterSpace)
            this.domains = this.simSet.optimiserParams.parameterSpace
                .filter((param: { id: string; domain: Domain }) => param.domain.optimise)
                .map((param: { id: string; domain: Domain }) => param.id);
        this.domainCount = this.domains.length;
        if (this.simSet.optimiserStates) {
            this.x = this.simSet.optimiserStates
                .map((state: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>) => {
                    return state.optimiserData.dataPoints;
                })
                .map(
                    (dataPoints: DataPoint<ConfiguratorParamsDTO<C1ConfiguratorParamData>, GradientAscentOutput>[]) => {
                        return dataPoints.filter((dataPoint) => dataPoint.id === "x")[0];
                    }
                )
                .map((dataPoint: DataPoint<ConfiguratorParamsDTO<C1ConfiguratorParamData>, GradientAscentOutput>) => {
                    dataPoint.data.inputs.data.gains.influence =
                        Math.round(1000 * dataPoint.data.inputs.data.gains.influence) / 1000;
                    dataPoint.data.inputs.data.gains.judgment =
                        Math.round(1000 * dataPoint.data.inputs.data.gains.judgment) / 1000;
                    dataPoint.data.inputs.data.gains.incentive =
                        Math.round(100000 * dataPoint.data.inputs.data.gains.incentive) / 100000;
                    return flatten(dataPoint.data.inputs.data);
                });
            this.simSet.optimiserStates.forEach(
                (optimiserState: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>) => {
                    let statePoints: any[] = [];
                    for (let domain of this.domains) {
                        let dataPoint = optimiserState.optimiserData.dataPoints.find(
                            (
                                dataPoint: DataPoint<
                                    ConfiguratorParamsDTO<C1ConfiguratorParamData>,
                                    GradientAscentOutput
                                >
                            ) => {
                                return dataPoint.id === domain;
                            }
                        );
                        if (dataPoint?.data.outputs.slope) {
                            statePoints.push(Math.round(dataPoint.data.outputs.slope * 100000) / 100000);
                        } else if (dataPoint?.data.outputs.performanceDelta) {
                            statePoints.push(Math.round(dataPoint.data.outputs.performanceDelta * 100000) / 100000);
                        } else {
                            statePoints.push(undefined);
                        }
                    }
                    this.del.push(statePoints);
                }
            );
        }
    }
}
