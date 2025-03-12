import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResultIndexComponent } from "./index/result-index.component";
import { ResultComponent } from "./top/result.component";
import { WidgetsModule } from "../../../widgets/widgets.module";
import { ResultPivotComponent } from './pivot/result-pivot.component';

@NgModule({
    declarations: [ResultIndexComponent, ResultComponent, ResultPivotComponent],
    imports: [CommonModule, WidgetsModule],
    exports: [ResultComponent]
})
export class ResultModule {}
