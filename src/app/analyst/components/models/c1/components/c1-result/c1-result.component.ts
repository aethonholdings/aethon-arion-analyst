import { Component, Input } from "@angular/core";
import { C1 } from "aethon-arion-c1";
import { KPIFactoryIndex } from "aethon-arion-c1/dist/constants/c1.model.constants";
import { KPIDTO, PlanVsActualsKPIs, ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-result",
    templateUrl: "./c1-result.component.html",
    styleUrls: ["./c1-result.component.scss"]
})
export class C1ResultComponent {
    @Input() resultDTO!: ResultDTO;
    kpis!: KPIDTO<PlanVsActualsKPIs>;
    agentCount!: number;

    constructor() {}

    ngOnInit(): void {
        this.kpis = C1.getKPIFactory(KPIFactoryIndex.PLAN_VS_ACTUALS).generate(this.resultDTO);
        const orgConfig = this.resultDTO.simConfig?.orgConfig;
        if (!orgConfig) throw new Error("Organisation config not found");
        this.agentCount = orgConfig.agentCount;
    }
}
