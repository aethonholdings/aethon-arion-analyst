import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatrixComponent } from "./components/matrix/components/matrix/matrix.component";
import { MatrixModule } from "./components/matrix/matrix.module";
import { GraphModule } from "./components/graph/graph.module";
import { GraphComponent } from "./components/graph/components/graph/graph.component";
import { StatusIndicatorComponent } from './components/status-indicator/status-indicator.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
    declarations: [StatusIndicatorComponent, PaginationComponent],
    imports: [CommonModule, MatrixModule, GraphModule],
    exports: [MatrixComponent, GraphComponent, StatusIndicatorComponent, PaginationComponent],
})
export class WidgetsModule {}
