import { NgModule } from "@angular/core";
import { SimConfigModule } from "./sim-config/sim-config.module";
import { SimSetModule } from "./sim-set/sim-set.module";
import { OrgConfigModule } from "./org-config/org-config.module";
import { ConfiguratorParamsModule } from "./configurator-params/configurator-params.module";
import { OptimiserStateModule } from "./optimiser-state/optimiser-state.module";

@NgModule({
    imports: [
        SimSetModule,
        SimConfigModule,
        OrgConfigModule,
        ConfiguratorParamsModule,
        OptimiserStateModule
    ],
    exports: [
        SimSetModule,
        SimConfigModule,
        OrgConfigModule,
        ConfiguratorParamsModule,
        OptimiserStateModule
    ]
})
export class AnalystComponentsCoreModule {}
