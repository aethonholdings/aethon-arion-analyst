import { NgModule } from "@angular/core";
import { SimConfigViewContainerComponent } from "./sim-config/view/sim-config-view-container.component";
import { AnalystComponentsModule } from "../components/analyst-components.module";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { SimSetIndexContainerComponent } from "./sim-set/index/sim-set-index-container.component";
import { ResultViewContainerComponent } from "./result/view/result-view-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { AnalystModelsModule } from "../models/analyst-models.module";

@NgModule({
    declarations: [
        SimConfigViewContainerComponent,
        SimSetIndexContainerComponent,
        SimSetViewContainerComponent,
        SimSetCreateContainerComponent,
        SimSetCreateContainerComponent,
        ResultViewContainerComponent
    ],
    imports: [AnalystComponentsModule, AnalystModelsModule],
    exports: [
        SimConfigViewContainerComponent,
        SimSetIndexContainerComponent,
        SimSetViewContainerComponent,
        SimSetCreateContainerComponent,
        ResultViewContainerComponent
    ]
})
export class AnalystContainerModule {}
