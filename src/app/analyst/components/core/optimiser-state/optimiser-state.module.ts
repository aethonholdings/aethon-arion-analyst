import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OptimiserStateComponent } from "./top/optimiser-state.component";
import { WidgetsModule } from "src/app/analyst/widgets/widgets.module";
import { ModelsModule } from "../../models/models.module";
import { OptimiserStateViewComponent } from './view/optimiser-state-view.component';

@NgModule({
    declarations: [OptimiserStateComponent, OptimiserStateViewComponent],
    imports: [CommonModule, WidgetsModule, ModelsModule],
    exports: [OptimiserStateComponent]
})
export class OptimiserStateModule {}
