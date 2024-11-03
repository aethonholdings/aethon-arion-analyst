import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { SpinnerService } from "../../services/spinner.service";

@Component({
    selector: "arion-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {
    spinnerText$: Observable<string>;
    constructor(private spinnerService: SpinnerService) {
        this.spinnerText$ = this.spinnerService.getText$();
    }
}
