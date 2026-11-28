import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MonitorContainerComponent } from "./monitor/monitor-container.component";
import { FormsModule } from "@angular/forms";
import { ExperimentCreateContainerComponent } from "./experiment/experiment-create-container.component";
import { ControlExperimentResultComponent } from "./experiment/control-experiment-result.component";
import { SimSetIndexContainerComponent } from "./sim-set/index/sim-set-index-container.component";
import { AnalystComponentModule } from "../components/analyst-component.module";
import { SimSetViewContainerComponent } from "./sim-set/view/sim-set-view-container.component";
import { SimSetCreateContainerComponent } from "./sim-set/create/sim-set-create-container.component";
import { WidgetsModule } from "../widgets/widgets.module";
import { SimConfigViewContainerComponent } from "./sim-config/view/sim-config-view-container.component";
import { ResultModule } from "../components/core/result/result.module";
import { ResultViewContainerComponent } from "./result/view/result-view-container.component";
import { OptimiserStateViewContainerComponent } from './optimiser-state/view/optimiser-state-view-container.component';
import { OrgConfigViewContainerComponent } from './org-config/view/org-config-view-container.component';
import { OrgConfigIndexContainerComponent } from './org-config/index/org-config-index-container.component';
import { SimSetOrgConfigContainerComponent } from './sim-set/org-config/sim-set-org-config-container.component';

@NgModule({
    declarations: [
        SimSetIndexContainerComponent,
        SimSetViewContainerComponent,
        SimSetCreateContainerComponent,
        SimConfigViewContainerComponent,
        ResultViewContainerComponent,
        OptimiserStateViewContainerComponent,
        OrgConfigViewContainerComponent,
        OrgConfigIndexContainerComponent,
        SimSetOrgConfigContainerComponent,
        MonitorContainerComponent,
        ExperimentCreateContainerComponent,
        ControlExperimentResultComponent
    ],
    imports: [CommonModule, FormsModule, RouterModule, WidgetsModule, AnalystComponentModule, ResultModule],
    exports: [SimSetIndexContainerComponent, SimSetViewContainerComponent, ResultViewContainerComponent]
})
export class AnalystContainerModule {}
