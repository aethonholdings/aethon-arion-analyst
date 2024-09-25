import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./modules/routing/app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { ApiModule } from "./modules/api/api.module";
import { AnalystModule } from "../analyst/analyst.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerModule } from "./modules/spinner/spinner.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [AppComponent, NavbarComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ApiModule,
        SpinnerModule,
        BrowserAnimationsModule,
        AnalystModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
