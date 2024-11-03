import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GraphComponent } from "./components/graph/graph.component";
import { GraphService } from "./services/graph.service";

@NgModule({
    declarations: [GraphComponent],
    imports: [CommonModule],
    exports: [GraphComponent],
    providers: [GraphService]
})
export class GraphModule {}
