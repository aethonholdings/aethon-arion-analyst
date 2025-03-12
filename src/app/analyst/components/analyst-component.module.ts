import { NgModule } from "@angular/core";
import { AnalystComponentsCoreModule } from "./core/analyst-components-core.module";

@NgModule({
    imports: [AnalystComponentsCoreModule],
    exports: [AnalystComponentsCoreModule],
})
export class AnalystComponentModule {}
