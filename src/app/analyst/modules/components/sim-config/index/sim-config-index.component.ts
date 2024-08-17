import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfiguratorParamsDTO, SimConfigDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-sim-config-index",
    templateUrl: "./sim-config-index.component.html",
    styleUrls: ["./sim-config-index.component.scss"]
})
export class SimConfigIndexComponent {
    @Input() simConfigs: SimConfigDTO[] = [];
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    asConfiguratorParamsDTO(val: unknown): ConfiguratorParamsDTO {
        return val as ConfiguratorParamsDTO;
    }

    simState(simConfig: SimConfigDTO): "running" | "pending" | "completed" | "failed" | undefined {
        if (!simConfig.start) {
            return !simConfig.end ? "pending" : "failed";
        } else {
            return simConfig.end ? "completed" : "running";
        }
    }

    ngOnChanges() {
        this.simConfigs = this.simConfigs.sort((a: SimConfigDTO, b: SimConfigDTO) => {
            return (b.avgPerformance ? b.avgPerformance : 0) - (a.avgPerformance ? a.avgPerformance : 0);
        });
    }
}
