import { NgModule } from "@angular/core";
import { AnalystContainerModule } from "./containers/analyst-container.module";
import { AnalystService } from "./services/analyst.service";
import { ModelService } from "./services/model.service";

@NgModule({
    imports: [AnalystContainerModule],
    providers: [AnalystService, ModelService],
    exports: [AnalystContainerModule]
})
export class AnalystModule {}
