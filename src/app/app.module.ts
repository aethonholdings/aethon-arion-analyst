import { NgModule } from "@angular/core";
import { RootModule } from "./root/root.module";
import { AnalystModule } from "./analyst/analyst.module";
import { AppComponent } from "./root/components/app/app.component";

@NgModule({
    imports: [RootModule, AnalystModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
