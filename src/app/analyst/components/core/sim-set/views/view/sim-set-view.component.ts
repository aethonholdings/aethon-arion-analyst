import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Domain, SimSetDTO } from "aethon-arion-pipeline";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    standalone: false,
    selector: "arion-sim-set-view",
    templateUrl: "./sim-set-view.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./sim-set-view.component.scss"]
})
export class SimSetViewComponent {
    @Input() simSet!: SimSetDTO;

    optimisationParameters!: { id: string; domain: Domain }[];

    ngOnInit(): void {
        if (this.simSet?.optimiserParams) {
            // optimisers without a parameter space (e.g. a control experiment) have no optimised parameters
            this.optimisationParameters = (this.simSet.optimiserParams.parameterSpace ?? []).filter(
                (parameter: { id: string; domain: Domain }) => (parameter.domain.optimise ? true : false)
            );
        }
    }

    constructor(private analystService: AnalystService) {}

    getPercentComplete(): string {
        if (!this.simSet) return "n.a.";
        return this.analystService.getPercentComplete(this.simSet);
    }
}
