import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimSetIndexContainerComponent } from "./sim-set/index/sim-set-index-container.component";
import { AnalystComponentModule } from "../components/analyst-component.module";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { WidgetsModule } from "../widgets/widgets.module";
import { SimConfigViewContainerComponent } from "./sim-config/view/sim-config-view-container.component";

@NgModule({
    declarations: [
        SimSetIndexContainerComponent,
        SimSetViewContainerComponent,
        SimSetCreateContainerComponent,
        SimConfigViewContainerComponent
    ],
    imports: [CommonModule, WidgetsModule, AnalystComponentModule],
    exports: [SimSetIndexContainerComponent, SimSetViewContainerComponent]
})
export class AnalystContainerModule {}
