import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SimConfigViewContainerComponent } from "src/app/analyst/containers/sim-config/view/sim-config-view-container.component";
import { SimSetCreateContainerComponent } from "src/app/analyst/containers/sim-set/create/sim-set-create-container.component";
import { SimSetIndexContainerComponent } from "src/app/analyst/containers/sim-set/index/sim-set-index-container.component";
import { SimSetViewContainerComponent } from "src/app/analyst/containers/sim-set/view/sim-set-view-container.component";

const routes: Routes = [
    {
        path: "sim-set",
        children: [
            { path: "create", component: SimSetCreateContainerComponent },
            { path: ":id", component: SimSetViewContainerComponent },
            { path: "", component: SimSetIndexContainerComponent }
        ]
    },
    {
        path: "sim-config",
        children: [
            { path: ":id", component: SimConfigViewContainerComponent }
        ]
    },
    { path: "", redirectTo: "sim-set", pathMatch: "full" } // Default route
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
