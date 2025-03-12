import { NgModule } from "@angular/core";
import { SimConfigModule } from "./sim-config/sim-config.module";
import { SimSetModule } from "./sim-set/sim-set.module";
import { OrgConfigModule } from "./org-config/org-config.module";

@NgModule({
    imports: [SimSetModule, SimConfigModule, OrgConfigModule],
    exports: [SimSetModule, SimConfigModule, OrgConfigModule]
})
export class AnalystComponentsCoreModule {}
