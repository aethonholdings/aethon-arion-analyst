import { Component, Input, OnInit } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import {
    ConfiguratorParamsDTO,
    DataPoint,
    GradientAscentOptimiserData,
    GradientAscentOutput,
    OptimiserStateDTO
} from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-optimiser-state",
    templateUrl: "./c1-optimiser-state.component.html",
    styleUrls: ["./c1-optimiser-state.component.scss"]
})
export class C1OptimiserStateComponent implements OnInit {
    @Input() optimiserState!: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>;
    x!: DataPoint<ConfiguratorParamsDTO<C1ConfiguratorParamData>, GradientAscentOutput> | undefined;
    del!: DataPoint<ConfiguratorParamsDTO<C1ConfiguratorParamData>, GradientAscentOutput>[] | undefined;
    agentCounts: number[] = [];

    ngOnInit(): void {
        for (let input of this.optimiserState.optimiserData.dataPoints) {
            let agentCount: number;
            input.data.inputs.data.spans > 1
                ? (agentCount =
                      (input.data.inputs.data.spans ** input.data.inputs.data.layers - 1) /
                      (input.data.inputs.data.spans - 1))
                : (agentCount = input.data.inputs.data.layers);
            this.agentCounts.push(agentCount);
        }
        this.x = this.optimiserState.optimiserData.dataPoints.find((dataPoint) => dataPoint.id === "x");
        this.del = this.optimiserState.optimiserData.dataPoints.filter((dataPoint) => dataPoint.id !== "x");
    }
}
