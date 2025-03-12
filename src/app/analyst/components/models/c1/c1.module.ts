import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { C1PlantComponent } from "./components/c1-plant/c1-plant.component";
import { C1ReportingComponent } from "./components/c1-reporting/c1-reporting.component";
import { C1BoardComponent } from "./components/c1-board/c1-board.component";
import { WidgetsModule } from "src/app/analyst/widgets/widgets.module";
import { C1ResultComponent } from "./components/c1-result/c1-result.component";

@NgModule({
    declarations: [C1PlantComponent, C1ReportingComponent, C1BoardComponent, C1ResultComponent],
    imports: [CommonModule, FormsModule, WidgetsModule],
    exports: [C1PlantComponent, C1ReportingComponent, C1BoardComponent, C1ResultComponent]
})
export class C1Module {}
