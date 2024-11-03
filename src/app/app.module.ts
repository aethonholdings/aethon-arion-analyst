import { NgModule } from "@angular/core";
import { RootModule } from "./root/root.module";
import { AnalystModule } from "./analyst/analyst.module";
import { AppComponent } from "./root/modules/app-container/components/app/app.component";

@NgModule({
    declarations: [],
    imports: [RootModule, AnalystModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
