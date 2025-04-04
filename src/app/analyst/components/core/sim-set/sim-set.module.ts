import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimSetComponent } from "./views/top/sim-set.component";
import { SimSetIndexComponent } from "./views/index/sim-set-index.component";
import { WidgetsModule } from "../../../widgets/widgets.module";
import { SimSetViewComponent } from "./views/view/sim-set-view.component";
import { SimSetCreateComponent } from "./views/create/sim-set-create.component";
import { FormsModule } from "@angular/forms";
import { ModelsModule } from "../../models/models.module";
import { SimSetStateTransitionsComponent } from "./subcomponents/sim-set-state-transitions/sim-set-state-transitions.component";

@NgModule({
    declarations: [SimSetComponent, SimSetIndexComponent, SimSetViewComponent, SimSetCreateComponent, SimSetStateTransitionsComponent],
    imports: [CommonModule, ModelsModule, FormsModule, WidgetsModule],
    exports: [SimSetComponent, SimSetStateTransitionsComponent]
})
export class SimSetModule {}
