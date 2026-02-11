import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { OptimiserStateComponent } from "./top/optimiser-state.component";
import { WidgetsModule } from "src/app/analyst/widgets/widgets.module";
import { ModelsModule } from "../../models/models.module";
import { OptimiserStateViewComponent } from './view/optimiser-state-view.component';
import { OptimiserStateOrgconfigViewComponent } from './views/orgconfig/optimiser-state-orgconfig-view.component';

@NgModule({
    declarations: [OptimiserStateComponent, OptimiserStateViewComponent, OptimiserStateOrgconfigViewComponent],
    imports: [CommonModule, RouterModule, WidgetsModule, ModelsModule],
    exports: [OptimiserStateComponent]
})
export class OptimiserStateModule {}
