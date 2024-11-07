import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { SpinnerService } from "../../services/spinner.service";

@Component({
    selector: "arion-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {
    progress$: Observable<string>;

    constructor(private spinnerService: SpinnerService) {
        this.progress$ = this.spinnerService.getProgress$();
    }
}
