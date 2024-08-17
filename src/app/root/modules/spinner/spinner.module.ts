import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerService } from "./services/spinner.service";
import { SpinnerComponent } from "./components/spinner.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [SpinnerComponent],
    imports: [CommonModule, NgxSpinnerModule],
    providers: [SpinnerService],
    exports: [SpinnerComponent]
})
export class SpinnerModule {}
