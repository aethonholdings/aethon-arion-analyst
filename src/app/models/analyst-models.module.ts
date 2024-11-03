import { NgModule } from "@angular/core";
import { AnalystCoreModule } from "./core/analyst-core.module";
import { AnalystC1Module } from "./c1/analyst-c1.module";
import { CommonModule } from "@angular/common";
import { WidgetsModule } from "../widgets/widgets.module";

@NgModule({
    imports: [CommonModule, AnalystCoreModule, AnalystC1Module],
    exports: [CommonModule, AnalystCoreModule, WidgetsModule]
})
export class AnalystModelsModule {}
