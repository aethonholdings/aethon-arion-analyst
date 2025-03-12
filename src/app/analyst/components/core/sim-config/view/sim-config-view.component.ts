import { Component, Input } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { Summary } from "src/app/analyst/types/analyst.types";

@Component({
    selector: "arion-sim-config-view",
    templateUrl: "./sim-config-view.component.html",
    styleUrls: ["./sim-config-view.component.scss"]
})
export class SimConfigViewComponent {
    @Input() simConfig!: SimConfigDTO;
    summaryTitle!: string;
    summary!: Summary;
    views = Views;

    ngOnInit(): void {
        this.summaryTitle = "Sim Config ID " + this.simConfig?.id?.toString();
        this.summary = [
            { key: "ID", value: this.simConfig?.id, class: "width-id" },
            { key: "Days", value: this.simConfig?.days },
            { key: "Configurator", value: this.simConfig?.orgConfig?.configuratorParams.configuratorName },
            { key: "Average performance", value: this.simConfig?.avgPerformance?.toFixed(0) },
            { key: "Sigma", value: this.simConfig?.stdDevPerformance?.toFixed(1) },
            { key: "Entropy", value: this.simConfig?.entropy?.toFixed(1) }
        ];
    }
}
