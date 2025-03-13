import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResultIndexComponent } from "./index/result-index.component";
import { ResultComponent } from "./top/result.component";
import { WidgetsModule } from "../../../widgets/widgets.module";
import { ResultPivotComponent } from "./pivot/result-pivot.component";
import { ResultViewComponent } from "./view/result-view.component";
import { ModelsModule } from "../../models/models.module";

@NgModule({
    declarations: [ResultIndexComponent, ResultComponent, ResultPivotComponent, ResultViewComponent],
    imports: [CommonModule, WidgetsModule, ModelsModule],
    exports: [ResultComponent]
})
export class ResultModule {}
