import { Component, Input } from "@angular/core";
import { OrgConfigDTO, Utils } from "aethon-arion-pipeline";
import { AgentSetReportData } from "src/app/analyst/types/analyst.types";
import { AnalystModelsService } from "../../services/analyst-models.service";

@Component({
    selector: "arion-agent-set-tensors",
    templateUrl: "./agent-set-tensors.component.html",
    styleUrls: ["./agent-set-tensors.component.scss"]
})
export class AgentSetTensorsComponent {
    @Input() orgConfigDTO: OrgConfigDTO = {} as OrgConfigDTO;
    agentSetReportData: AgentSetReportData = {} as AgentSetReportData;
    priorityTensor: number[][][] = [];
    judgmentTensor: number[][][][] = [];
    influenceTensor: number[][][][] = [];
    incentiveTensor: number[][][][] = [];
    columnCount: number = 0;

    constructor(private analystModelsService: AnalystModelsService) {}

    ngOnInit(): void {
        this.agentSetReportData = this.analystModelsService.getAgentSetReportData(this.orgConfigDTO);
        this.priorityTensor = this.agentSetReportData.agentSetTensorsDTO.priorityTensor;
        this.influenceTensor = this.agentSetReportData.agentSetTensorsDTO.influenceTensor;
        this.judgmentTensor = this.transformTensor(this.agentSetReportData.agentSetTensorsDTO.judgmentTensor);
        this.incentiveTensor = this.transformTensor(this.agentSetReportData.agentSetTensorsDTO.incentiveTensor);
        this.columnCount = this.agentSetReportData.agentSetTensorsDTO.priorityTensor.length + 1;
    }

    transformTensor(tensor: number[][][][]): number[][][][] {
        const shape = Utils.shape(tensor);
        const transformed = Utils.tensor([shape[3], shape[0], shape[1], shape[2]], () => 0) as number[][][][];
        for (let alpha = 0; alpha < shape[0]; alpha++) {
            for (let sigma = 0; sigma < shape[1]; sigma++) {
                for (let tau = 0; tau < shape[2]; tau++) {
                    for (let chi = 0; chi < shape[3]; chi++) {
                        transformed[chi][alpha][sigma][tau] = tensor[alpha][sigma][tau][chi];
                    }
                }
            }
        }
        return transformed;
    }
}
