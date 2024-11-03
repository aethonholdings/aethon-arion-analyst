import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AppRoutingModule } from "../routing/app-routing.module";
import { SpinnerComponent } from "./spinner/spinner.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
    declarations: [AppComponent, NavbarComponent, SpinnerComponent],
    imports: [CommonModule, BrowserModule, BrowserAnimationsModule, AppRoutingModule, NgxSpinnerModule],
    exports: [SpinnerComponent]
})
export class AppComponentModule {}
