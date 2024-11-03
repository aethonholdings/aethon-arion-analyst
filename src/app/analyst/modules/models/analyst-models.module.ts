import { NgModule } from "@angular/core";
import { AnalystC1Module } from "./c1/analyst-c1.module";
import { ConfiguratorComponent } from "./core/components/configurator/configurator.component";
import { PlantComponent } from "./core/components/plant/plant.component";
import { ReportingComponent } from "./core/components/reporting/reporting.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ResultComponent } from "./core/components/result/result.component";
import { AgentSetTensorsComponent } from "./core/components/agent-set-tensors/agent-set-tensors.component";
import { WidgetsModule } from "../widgets/widgets.module";
import { AnalystModelsService } from "./core/services/analyst-models.service";
import { BatchGeneratorComponent } from "./core/components/batch-generator/batch-generator.component";
import { OrgConfigComponent } from "./core/components/org-config/org-config.component";
import { SimConfigComponent } from "./core/components/sim-config/sim-config.component";
import { SimSetComponent } from "./core/components/sim-set/sim-set.component";
import { ResultSetComponent } from "./core/components/result-set/result-set.component";
import { BoardComponent } from "./core/components/board/board.component";

@NgModule({
    declarations: [
        ConfiguratorComponent,
        PlantComponent,
        BoardComponent,
        ReportingComponent,
        ResultComponent,
        AgentSetTensorsComponent,
        BatchGeneratorComponent,
        OrgConfigComponent,
        SimConfigComponent,
        SimSetComponent,
        ResultSetComponent
    ],
    imports: [CommonModule, FormsModule, AnalystC1Module, WidgetsModule],
    providers: [AnalystModelsService],
    exports: [
        CommonModule,
        FormsModule,
        WidgetsModule,
        ConfiguratorComponent,
        PlantComponent,
        BoardComponent,
        ReportingComponent,
        AgentSetTensorsComponent,
        ResultComponent,
        BatchGeneratorComponent,
        OrgConfigComponent,
        SimConfigComponent,
        SimSetComponent,
        ResultSetComponent
    ]
})
export class AnalystModelsModule {}
