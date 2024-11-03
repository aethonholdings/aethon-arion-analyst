import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./modules/routing/app-routing.module";
import { AppContainerModule } from "./modules/app-container/app-container.module";
import { ApiModule } from "./modules/api/api.module";

@NgModule({
    imports: [AppContainerModule, AppRoutingModule, ApiModule]
})
export class RootModule {}
