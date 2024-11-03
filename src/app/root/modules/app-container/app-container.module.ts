import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app/app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AppRoutingModule } from "../routing/app-routing.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { SpinnerService } from "./services/spinner.service";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
    declarations: [AppComponent, NavbarComponent, SpinnerComponent],
    imports: [CommonModule, BrowserModule, BrowserAnimationsModule, AppRoutingModule, NgxSpinnerModule],
    providers: [SpinnerService],
    exports: [SpinnerComponent]
})
export class AppContainerModule {}
