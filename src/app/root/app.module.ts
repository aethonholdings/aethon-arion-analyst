import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./modules/routing/app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { ApiModule } from "./modules/api/api.module";
import { FormsModule } from "@angular/forms";
import { AnalystModule } from "../analyst/analyst.module";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SpinnerComponent } from './modules/spinner/components/spinner.component';
import { SpinnerModule } from "./modules/spinner/spinner.module";

@NgModule({
    declarations: [AppComponent, NavbarComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        ApiModule,
        AnalystModule,
        BrowserAnimationsModule,
        SpinnerModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
