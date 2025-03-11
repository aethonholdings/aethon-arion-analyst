import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { C1Module } from "./c1/c1.module";

@NgModule({
    imports: [CommonModule, C1Module],
    exports: [C1Module]
})
export class ModelsModule {}
