import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrgConfigViewComponent } from "./org-config/view/org-config-view.component";
import { OrgConfigCardComponent } from "./org-config/card/org-config-card.component";
import { ResultIndexComponent } from "./result/index/result-index.component";
import { StateSpaceViewComponent } from "./state-space/view/state-space-view.component";
import { SimConfigIndexComponent } from "./sim-config/index/sim-config-index.component";
import { SimConfigViewComponent } from "./sim-config/view/sim-config-view.component";
import { SimSetIndexComponent } from "./sim-set/index/sim-set-index.component";
import { SimSetViewComponent } from "./sim-set/view/sim-set-view.component";
import { SimSetCardComponent } from "./sim-set/card/sim-set-card.component";
import { SimConfigCardComponent } from "./sim-config/card/sim-config-card.component";
import { ResultViewComponent } from "./result/view/result-view.component";
import { SimSetCreateComponent } from "./sim-set/create/sim-set-create.component";
import { ConfiguratorCardComponent } from "./configurator/card/configurator-card.component";
import { BatchGeneratorViewComponent } from "./batch-generator/view/batch-generator-view.component";
import { ResultSetViewComponent } from "./result-set/view/result-set-view.component";
import { AnalystModelsModule } from "src/app/models/analyst-models.module";

@NgModule({
    declarations: [
        OrgConfigViewComponent,
        ResultIndexComponent,
        StateSpaceViewComponent,
        SimConfigViewComponent,
        SimConfigIndexComponent,
        SimSetIndexComponent,
        SimSetViewComponent,
        SimSetCardComponent,
        SimConfigCardComponent,
        ResultViewComponent,
        SimSetCreateComponent,
        ConfiguratorCardComponent,
        BatchGeneratorViewComponent,
        OrgConfigCardComponent,
        ResultSetViewComponent
    ],
    imports: [AnalystModelsModule],
    exports: [
        CommonModule,
        FormsModule,
        SimConfigIndexComponent,
        SimConfigViewComponent,
        SimSetIndexComponent,
        SimSetViewComponent,
        SimSetCreateComponent,
        OrgConfigViewComponent,
        ResultIndexComponent,
        ResultViewComponent,
        StateSpaceViewComponent,
        ConfiguratorCardComponent,
        BatchGeneratorViewComponent,
        OrgConfigCardComponent,
        ResultSetViewComponent
    ]
})
export class AnalystComponentsModule {}
