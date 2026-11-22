import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { SimConfigDTO, StateType } from "aethon-arion-pipeline";

@Component({
    standalone: false,
    selector: "arion-sim-config-index",
    templateUrl: "./sim-config-index.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./sim-config-index.component.scss"]
})
export class SimConfigIndexComponent {
    @Input() simConfigs!: SimConfigDTO[];
    @Input() compact: boolean = false;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();

    simState(simConfig: SimConfigDTO): StateType {
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
