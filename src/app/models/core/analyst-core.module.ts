import { NgModule } from "@angular/core";
import { AnalystC1Module } from "../c1/analyst-c1.module";
import { ConfiguratorComponent } from "./components/configurator/configurator.component";
import { PlantComponent } from "./components/plant/plant.component";
import { ReportingComponent } from "./components/reporting/reporting.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ResultComponent } from "./components/result/result.component";
import { AgentSetTensorsComponent } from "./components/agent-set-tensors/agent-set-tensors.component";
import { WidgetsModule } from "../../widgets/widgets.module";
import { AnalystModelsService } from "./services/analyst-models.service";
import { BatchGeneratorComponent } from "./components/batch-generator/batch-generator.component";
import { OrgConfigComponent } from "./components/org-config/org-config.component";
import { SimConfigComponent } from "./components/sim-config/sim-config.component";
import { SimSetComponent } from "./components/sim-set/sim-set.component";
import { ResultSetComponent } from "./components/result-set/result-set.component";
import { BoardComponent } from "./components/board/board.component";

@NgModule({
    declarations: [
        AgentSetTensorsComponent,
        BatchGeneratorComponent,
        BoardComponent,
        ConfiguratorComponent,
        OrgConfigComponent,
        PlantComponent,
        ReportingComponent,
        ResultComponent,
        ResultSetComponent,
        SimConfigComponent,
        SimSetComponent
    ],
    imports: [CommonModule, FormsModule, AnalystC1Module, WidgetsModule],
    providers: [AnalystModelsService],
    exports: [
        AgentSetTensorsComponent,
        BatchGeneratorComponent,
        BoardComponent,
        CommonModule,
        ConfiguratorComponent,
        FormsModule,
        OrgConfigComponent,
        PlantComponent,
        ReportingComponent,
        ResultComponent,
        ResultSetComponent,
        SimConfigComponent,
        SimSetComponent,
        WidgetsModule
    ]
})
export class AnalystCoreModule {}
