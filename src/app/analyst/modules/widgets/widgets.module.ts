import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatrixComponent } from "./components/matrix/components/matrix/matrix.component";
import { MatrixModule } from "./components/matrix/matrix.module";
import { GraphModule } from "./components/graph/graph.module";
import { GraphComponent } from "./components/graph/components/graph/graph.component";
import { StatusIndicatorComponent } from "./components/status-indicator/status-indicator.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { PivotTableComponent } from "./components/pivot-table/pivot-table.component";
import { RegressionComponent } from "./components/regression/regression.component";

@NgModule({
    declarations: [StatusIndicatorComponent, PaginationComponent, PivotTableComponent, RegressionComponent],
    imports: [CommonModule, MatrixModule, GraphModule],
    exports: [MatrixComponent, GraphComponent, StatusIndicatorComponent, PaginationComponent, PivotTableComponent]
})
export class WidgetsModule {}
