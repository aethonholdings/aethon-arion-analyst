import { Component, EventEmitter, Input, Output } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import {
    Domain,
    DomainType,
    DomainTypes,
    GradientAscentOptimiserData,
    OptimiserStateDTO,
    SimSetDTO
} from "aethon-arion-pipeline";

const flatten = require("flat");
type TableEntries = { [id: string]: { domainType: DomainType; value: number | string | boolean | undefined } };

@Component({
    selector: "arion-c1-optimiser-state-transitions",
    templateUrl: "./c1-optimiser-state-transitions.component.html",
    styleUrls: ["./c1-optimiser-state-transitions.component.scss"]
})
export class C1OptimiserStateTransitionsComponent {
    @Input() simSet!: SimSetDTO;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    states!: OptimiserStateDTO<GradientAscentOptimiserData<C1ConfiguratorParamData>>[];
    x: TableEntries[] = [];
    del: TableEntries[] = [];
    domainCount!: number;
    ready: boolean = false;
    optimisationDomains: { id: string; domain: Domain }[] = [];
    domainTypes = DomainTypes;
    domainIds: string[] = [
        "spans",
        "layers",
        "gains.influence",
        "gains.judgment",
        "gains.incentive",
        "actionStateProbability",
        "graph",
        "matrixInit.influence",
        "matrixInit.judgment",
        "matrixInit.incentive",
        "board.controlStep",
        "reporting.unitPayroll",
        "reporting.unitPrice"
    ];

    ngOnChanges(): void {
        if (this.simSet.optimiserParams.parameterSpace)
            this.domainIds.forEach((domainId: string) => {
                const domain = this.simSet.optimiserParams.parameterSpace.find(
                    (param: { id: string; domain: Domain }) => param.id === domainId && param.domain.optimise
                );
                if (domain) this.optimisationDomains.push(domain);
            });
        this.domainCount = this.optimisationDomains.length;
        if (this.simSet.optimiserStates) {
            this.states = this.simSet.optimiserStates;
            for (const state of this.states) {
                const xTableEntries: TableEntries = {};
                const delTableEntries: TableEntries = {};
                for (const dataPoint of state.optimiserData.dataPoints) {
                    if (dataPoint.id === "x") {
                        const flattened = flatten(dataPoint.data.inputs.data);
                        for (const domain of this.optimisationDomains) {
                            if (domain.domain.optimise) {
                                xTableEntries[domain.id] = {
                                    domainType: domain.domain.type,
                                    value: flattened[domain.id]
                                };
                            }
                        }
                    } else {
                        if (
                            dataPoint.data.outputs.domain.type === DomainTypes.CONTINUOUS ||
                            dataPoint.data.outputs.domain.type === DomainTypes.DISCRETE
                        ) {
                            delTableEntries[dataPoint.id] = {
                                domainType: dataPoint.data.outputs.domain.type,
                                value: dataPoint.data.outputs.slope
                            };
                        } else {
                            delTableEntries[dataPoint.id] = {
                                domainType: dataPoint.data.outputs.domain.type,
                                value: dataPoint.data.outputs.performanceDelta
                            };
                        }
                    }
                }
                this.x.push(xTableEntries);
                this.del.push(delTableEntries);
            }
        }
        this.ready = true;
        console.log(this.del);
    }
}
