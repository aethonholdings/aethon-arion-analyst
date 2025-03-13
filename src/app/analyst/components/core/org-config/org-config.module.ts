import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WidgetsModule } from "../../../widgets/widgets.module";
import { OrgConfigComponent } from "./views/top/org-config.component";
import { OrgConfigCardComponent } from "./views/card/org-config-card.component";
import { OrgConfigViewComponent } from "./views/view/org-config-view.component";
import { AgentSetTensorsComponent } from "./subcomponents/agent-set-tensors/agent-set-tensors.component";
import { PlantComponent } from "./subcomponents/plant/plant.component";
import { BoardComponent } from "./subcomponents/board/board.component";
import { ReportingComponent } from "./subcomponents/reporting/reporting.component";
import { ModelsModule } from "../../models/models.module";
import { ConfiguratorParamsModule } from "../configurator-params/configurator-params.module";

@NgModule({
    declarations: [
        OrgConfigComponent,
        OrgConfigCardComponent,
        OrgConfigViewComponent,
        AgentSetTensorsComponent,
        PlantComponent,
        ReportingComponent,
        BoardComponent,
    ],
    imports: [CommonModule, WidgetsModule, ModelsModule, ConfiguratorParamsModule],
    exports: [OrgConfigComponent]
})
export class OrgConfigModule {}
