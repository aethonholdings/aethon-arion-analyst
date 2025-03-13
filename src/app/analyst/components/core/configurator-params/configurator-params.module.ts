import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfiguratorParamsComponent } from "./top/configurator-params.component";
import { FormsModule } from "@angular/forms";
import { ConfiguratorParamsCardComponent } from "./card/configurator-params-card/configurator-params-card.component";
import { C1Module } from "../../models/c1/c1.module";

@NgModule({
    declarations: [ConfiguratorParamsComponent, ConfiguratorParamsCardComponent],
    imports: [CommonModule, FormsModule, C1Module],
    exports: [ConfiguratorParamsComponent]
})
export class ConfiguratorParamsModule {}
