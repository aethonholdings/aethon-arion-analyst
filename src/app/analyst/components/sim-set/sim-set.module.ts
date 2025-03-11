import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimSetComponent } from "./top/sim-set.component";
import { SimSetIndexComponent } from './index/sim-set-index.component';
import { WidgetsModule } from "../../widgets/widgets.module";
import { SimSetViewComponent } from "./view/sim-set-view.component";
import { SimSetCreateComponent } from "./create/sim-set-create.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [SimSetComponent, SimSetIndexComponent, SimSetViewComponent, SimSetCreateComponent],
    imports: [CommonModule, FormsModule, WidgetsModule],
    exports: [SimSetComponent]
})
export class SimSetModule {}
