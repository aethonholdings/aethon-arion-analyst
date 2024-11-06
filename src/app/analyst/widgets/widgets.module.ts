import { NgModule } from "@angular/core";
import { StatusIndicatorComponent } from "./status-indicator/status-indicator.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { PivotTableComponent } from "./pivot-table/pivot-table.component";
import { RegressionComponent } from "./regression/regression.component";
import { CommonModule } from "@angular/common";
import { MatrixModule } from "./matrix/matrix.module";
import { GraphModule } from "./graph/graph.module";
import { GraphComponent } from "./graph/components/graph/graph.component";
import { MatrixComponent } from "./matrix/components/matrix/matrix.component";

@NgModule({
    declarations: [StatusIndicatorComponent, PaginationComponent, PivotTableComponent, RegressionComponent],
    imports: [CommonModule, MatrixModule, GraphModule],
    exports: [MatrixComponent, GraphComponent, StatusIndicatorComponent, PaginationComponent, PivotTableComponent]
})
export class WidgetsModule {}
