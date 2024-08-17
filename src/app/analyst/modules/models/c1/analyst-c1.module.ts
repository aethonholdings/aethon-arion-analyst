import { C1PlantComponent } from "./components/c1-plant/c1-plant.component";
import { C1ReportingComponent } from "./components/c1-reporting/c1-reporting.component";
import { C1ResultComponent } from "./components/c1-result/c1-result.component";
import { C1ConfiguratorComponent } from "./components/c1-configurator/c1-configurator.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { WidgetsModule } from "../../widgets/widgets.module";
import { C1BatchGeneratorComponent } from "./components/c1-batch-generator/c1-batch-generator.component";
import { AnalystC1Service } from "./services/analyst-c1.service";
import { C1ResultSetComponent } from "./components/c1-result-set/c1-result-set.component";
import { SpinnerModule } from "src/app/root/modules/spinner/spinner.module";

@NgModule({
    declarations: [
        C1PlantComponent,
        C1ReportingComponent,
        C1ResultComponent,
        C1ConfiguratorComponent,
        C1BatchGeneratorComponent,
        C1ResultSetComponent
    ],
    imports: [CommonModule, FormsModule, WidgetsModule, SpinnerModule],
    providers: [AnalystC1Service],
    exports: [
        C1PlantComponent,
        C1ReportingComponent,
        C1ResultComponent,
        C1ConfiguratorComponent,
        C1BatchGeneratorComponent,
        C1ResultSetComponent
    ]
})
export class AnalystC1Module {}
