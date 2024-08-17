import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SimSetIndexContainerComponent } from "src/app/analyst/modules/containers/sim-set/index/sim-set-index-container.component";
import { SimSetViewContainerComponent } from "src/app/analyst/modules/containers/sim-set/view/sim-set-view-container.component";
import { SimConfigViewContainerComponent } from "src/app/analyst/modules/containers/sim-config/view/sim-config-view-container.component";
import { ResultViewContainerComponent } from "src/app/analyst/modules/containers/result/view/result-view-container.component";
import { SimSetCreateContainerComponent } from "src/app/analyst/modules/containers/sim-set/create/sim-set-create-container.component";


const routes: Routes = [
    { path: "sim-set",  component: SimSetIndexContainerComponent },
    { path: "sim-set/create",  component: SimSetCreateContainerComponent },
    { path: "sim-set/:id",  component: SimSetViewContainerComponent },
    { path: "sim-config/:id",  component: SimConfigViewContainerComponent },
    { path: "result/:id", component: ResultViewContainerComponent },
    { path: "", redirectTo: "sim-set", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
