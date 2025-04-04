import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OptimiserStateComponent } from "./top/optimiser-state.component";
import { WidgetsModule } from "src/app/analyst/widgets/widgets.module";

@NgModule({
    declarations: [OptimiserStateComponent],
    imports: [CommonModule, WidgetsModule],
    exports: [OptimiserStateComponent]
})
export class OptimiserStateModule {}
