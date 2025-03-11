import { NgModule } from "@angular/core";
import { SimSetModule } from "./sim-set/sim-set.module";
import { SimConfigModule } from "./sim-config/sim-config.module";
import { OrgConfigModule } from "./org-config/org-config.module";

@NgModule({
    imports: [SimSetModule, SimConfigModule, OrgConfigModule],
    exports: [SimSetModule, SimConfigModule, OrgConfigModule],
})
export class AnalystComponentModule {}
