import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { C1PlantComponent } from "./components/c1-plant/c1-plant.component";
import { C1ReportingComponent } from "./components/c1-reporting/c1-reporting.component";
import { C1BoardComponent } from "./components/c1-board/c1-board.component";
import { WidgetsModule } from "src/app/analyst/widgets/widgets.module";
import { C1ResultComponent } from "./components/c1-result/c1-result.component";
import { C1ConfiguratorParamsComponent } from "./components/c1-configurator-params/c1-configurator-params.component";
import { C1OptimiserStateTransitionsComponent } from "./components/c1-optimiser-state-transitions/c1-optimiser-state-transitions.component";
import { C1OptimiserStateComponent } from "./components/c1-optimiser-state/c1-optimiser-state.component";
import { C1SimSetComponent } from "./components/c1-sim-set/c1-sim-set.component";
import { C1Service } from "./services/c1.service";
import { C1GradientAscentOptimiserParamsComponent } from './components/c1-gradient-ascent-optimiser-params/c1-gradient-ascent-optimiser-params.component';

@NgModule({
    declarations: [
        C1PlantComponent,
        C1ReportingComponent,
        C1BoardComponent,
        C1ResultComponent,
        C1ConfiguratorParamsComponent,
        C1OptimiserStateTransitionsComponent,
        C1OptimiserStateComponent,
        C1SimSetComponent,
        C1GradientAscentOptimiserParamsComponent
    ],
    providers: [C1Service],
    imports: [CommonModule, FormsModule, WidgetsModule],
    exports: [
        C1PlantComponent,
        C1ReportingComponent,
        C1BoardComponent,
        C1ResultComponent,
        C1ConfiguratorParamsComponent,
        C1OptimiserStateTransitionsComponent,
        C1OptimiserStateComponent,
        C1SimSetComponent
    ]
})
export class C1Module {}
