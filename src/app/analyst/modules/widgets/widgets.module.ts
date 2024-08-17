import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatrixComponent } from "./components/matrix/components/matrix/matrix.component";
import { MatrixModule } from "./components/matrix/matrix.module";
import { GraphModule } from "./components/graph/graph.module";
import { GraphComponent } from "./components/graph/components/graph/graph.component";
import { StatusIndicatorComponent } from './components/status-indicator/status-indicator.component';

@NgModule({
    declarations: [StatusIndicatorComponent],
    imports: [CommonModule, MatrixModule, GraphModule],
    exports: [MatrixComponent, GraphComponent, StatusIndicatorComponent]
})
export class WidgetsModule {}
