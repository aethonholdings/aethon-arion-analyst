import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimSetIndexContainerComponent } from "./sim-set/index/sim-set-index-container.component";
import { AnalystComponentModule } from "../components/analyst-component.module";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { WidgetsModule } from "../widgets/widgets.module";
import { SimConfigViewContainerComponent } from "./sim-config/view/sim-config-view-container.component";
import { ResultModule } from "../components/core/result/result.module";
import { ResultViewContainerComponent } from "./result/view/result-view-container.component";

@NgModule({
    declarations: [
        SimSetIndexContainerComponent,
        SimSetViewContainerComponent,
        SimSetCreateContainerComponent,
        SimConfigViewContainerComponent,
        ResultViewContainerComponent
    ],
    imports: [CommonModule, WidgetsModule, AnalystComponentModule, ResultModule],
    exports: [SimSetIndexContainerComponent, SimSetViewContainerComponent, ResultViewContainerComponent]
})
export class AnalystContainerModule {}
