import { NgModule } from "@angular/core";
import { SimSetModule } from "./sim-set/sim-set.module";

@NgModule({
    imports: [SimSetModule],
    exports: [SimSetModule]
})
export class AnalystComponentModule {}
