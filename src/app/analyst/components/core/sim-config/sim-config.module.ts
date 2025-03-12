import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimConfigComponent } from "./top/sim-config.component";
import { SimConfigIndexComponent } from "./index/sim-config-index.component";
import { WidgetsModule } from "../../../widgets/widgets.module";
import { SimConfigViewComponent } from "./view/sim-config-view.component";
import { SimConfigCardComponent } from './card/sim-config-card.component';
import { OrgConfigModule } from "../org-config/org-config.module";

@NgModule({
    declarations: [SimConfigComponent, SimConfigIndexComponent, SimConfigViewComponent, SimConfigCardComponent],
    imports: [CommonModule, WidgetsModule, OrgConfigModule],
    exports: [SimConfigComponent]
})
export class SimConfigModule {}
