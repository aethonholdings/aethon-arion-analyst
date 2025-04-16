import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GradientAscentParameters } from "aethon-arion-pipeline";
import { DomainDefinition } from "src/app/analyst/widgets/domain/domain.component";
import { C1DomainDefinitions, C1GradientAscentDefaultOptimiserParams } from "../../constants/analyst-c1.constants";

@Component({
    selector: "arion-c1-gradient-ascent-optimiser-params",
    templateUrl: "./c1-gradient-ascent-optimiser-params.component.html",
    styleUrls: ["./c1-gradient-ascent-optimiser-params.component.scss"]
})
export class C1GradientAscentOptimiserParamsComponent implements OnInit {
    @Input() gradientAscentParameters!: GradientAscentParameters;
    @Output() gradientAscentParametersChange: EventEmitter<GradientAscentParameters> =
        new EventEmitter<GradientAscentParameters>();

    domainDefinitions: { [key: string]: DomainDefinition } = {};

    constructor() {
        C1DomainDefinitions.forEach((param) => {
            this.domainDefinitions[param.id] = param;
        });
    }

    ngOnInit(): void {
        if (!this.gradientAscentParameters) this.gradientAscentParameters = C1GradientAscentDefaultOptimiserParams;
    }

    onChanges() {
        console.log(this.gradientAscentParameters);
    }
}
