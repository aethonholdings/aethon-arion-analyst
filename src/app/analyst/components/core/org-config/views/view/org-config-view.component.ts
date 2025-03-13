import { Component, Input } from "@angular/core";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { Summary } from "src/app/analyst/types/analyst.types";

@Component({
    selector: "arion-org-config-view",
    templateUrl: "./org-config-view.component.html",
    styleUrls: ["./org-config-view.component.scss"]
})
export class OrgConfigViewComponent {
    @Input() orgConfig!: OrgConfigDTO;
    summaryTitle!: string;
    summary!: Summary;
    views = Views;

    constructor() {}

    ngOnInit(): void {
        this.summaryTitle = "Org config ID " + this.orgConfig.id?.toString();
        this.summary = [
            { key: "ID", value: this.orgConfig.id, class: "width-id" },
            { key: "Configurator", value: this.orgConfig.configuratorParams.configuratorName },
            { key: "Agent count", value: this.orgConfig.agentCount },
            { key: "Priority", value: this.orgConfig.priorityIntensity.toFixed(2) },
            { key: "Influence", value: this.orgConfig.influenceIntensity.toFixed(2) },
            { key: "Judgment", value: this.orgConfig.judgmentIntensity.toFixed(2) },
            { key: "Incentive", value: this.orgConfig.incentiveIntensity.toFixed(2) }
        ];
    }
}
