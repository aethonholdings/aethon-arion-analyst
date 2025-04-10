import { Component, Input } from "@angular/core";
import { Domain, SimSetDTO } from "aethon-arion-pipeline";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-set-view",
    templateUrl: "./sim-set-view.component.html",
    styleUrls: ["./sim-set-view.component.scss"]
})
export class SimSetViewComponent {
    @Input() simSet!: SimSetDTO;

    optimisationParameters!: { id: string; domain: Domain }[];

    ngOnInit(): void {
        if (this.simSet?.optimiserParams) {
            this.optimisationParameters = this.simSet?.optimiserParams.parameterSpace.filter(
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
