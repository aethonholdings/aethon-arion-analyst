import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamData, OptimiserStateDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-optimiser-state",
    templateUrl: "./optimiser-state.component.html",
    styleUrls: ["./optimiser-state.component.scss"]
})
export class OptimiserStateComponent {
    @Input() dataArray!: OptimiserStateDTO<ConfiguratorParamData>[];
    @Input() dataInstance!: OptimiserStateDTO<ConfiguratorParamData>;
    @Input() view!: string;
    @Output() dataArrayChange = new EventEmitter<OptimiserStateDTO<ConfiguratorParamData>[]>();
    @Output() dataInstanceChange = new EventEmitter<OptimiserStateDTO<ConfiguratorParamData>>();
    @Output() selected = new EventEmitter<number>();

    views = Views;
}
