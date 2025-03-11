import { NgModule } from "@angular/core";
import { SimSetModule } from "./sim-set/sim-set.module";
import { SimConfigModule } from "./sim-config/sim-config.module";

@NgModule({
    imports: [SimSetModule, SimConfigModule],
    exports: [SimSetModule, SimConfigModule],
})
export class AnalystComponentModule {}
