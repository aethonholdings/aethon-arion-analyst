import { Component, Input, OnInit } from "@angular/core";
import { C1ConfiguratorInitType, C1ResultSet } from "aethon-arion-c1";
import { SpinnerService } from "src/app/root/modules/spinner/services/spinner.service";

@Component({
    selector: "arion-c1-result-set",
    templateUrl: "./c1-result-set.component.html",
    styleUrls: ["./c1-result-set.component.scss"]
})
export class C1ResultSetComponent implements OnInit {
    @Input() resultSet: C1ResultSet | undefined;
    filteredResults: C1ResultSet | undefined;
    regression: {
        regressionResults: any;
        inputVariableNames: string[];
        outputVariableNames: string[];
    } | undefined;
    filters = {
        matrixInit: {
            influence: "any",
            judgment: "any",
            incentive: "any"
        },
        gains: {
            influence: null,
            judgment: null,
            incentive: null
        },
        clockTicks: null,
        agentCount: null
    };
    initialiserFilters: C1ConfiguratorInitType[] = ["random", "hybrid", "purposeful"];

    constructor(private spinnerService: SpinnerService) {}

    ngOnInit(): void {
        if (this.resultSet) {
            this.filteredResults = this.resultSet;
            this.regression = this.resultSet.getAgentPerformanceRegression();

        }
    }

    applyFilters(): void {
        this.spinnerService.show("Applying filter");
        // need a timeout for the DOM to update for spinner in synchronous code
        setTimeout(() => {
            let filters = { matrixInit: JSON.parse(JSON.stringify(this.filters.matrixInit)) };
            if (filters.matrixInit.influence === "any") delete filters.matrixInit.influence;
            if (filters.matrixInit.judgment === "any") delete filters.matrixInit.judgment;
            if (filters.matrixInit.incentive === "any") delete filters.matrixInit.incentive;
            if (this.resultSet) this.filteredResults = this.resultSet.filter(filters);
            this.spinnerService.hide();
        }, 500);
    }
}
