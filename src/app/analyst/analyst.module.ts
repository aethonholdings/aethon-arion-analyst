import { NgModule } from "@angular/core";
import { AnalystContainerModule } from "./modules/containers/analyst-container.module";
import { AnalystService } from "./services/analyst.service";
import { AnalystCoreModule } from "../models/core/analyst-core.module";

@NgModule({
    imports: [AnalystContainerModule, AnalystCoreModule],
    providers: [AnalystService],
    exports: [AnalystContainerModule]
})
export class AnalystModule {}
