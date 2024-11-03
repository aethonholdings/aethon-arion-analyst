import { NgModule } from "@angular/core";
import { AnalystContainerModule } from "./modules/containers/analyst-container.module";
import { AnalystService } from "./services/analyst.service";

@NgModule({
    imports: [AnalystContainerModule],
    providers: [AnalystService],
    exports: [AnalystContainerModule]
})
export class AnalystModule {}
