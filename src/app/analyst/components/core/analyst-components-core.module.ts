import { NgModule } from "@angular/core";
import { SimConfigModule } from "./sim-config/sim-config.module";
import { SimSetModule } from "./sim-set/sim-set.module";
import { OrgConfigModule } from "./org-config/org-config.module";
import { ConfiguratorParamsModule } from "./configurator-params/configurator-params.module";

@NgModule({
    imports: [SimSetModule, SimConfigModule, OrgConfigModule, ConfiguratorParamsModule],
    exports: [SimSetModule, SimConfigModule, OrgConfigModule, ConfiguratorParamsModule]
})
export class AnalystComponentsCoreModule {}
