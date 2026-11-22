import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { SpinnerService } from "./spinner.service";

@Component({
    standalone: false,
    selector: "arion-spinner",
    templateUrl: "./spinner.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {
    progress$: Observable<string>;
    text$: Observable<string>;

    constructor(private spinnerService: SpinnerService) {
        this.progress$ = this.spinnerService.getProgress$();
        this.text$ = this.spinnerService.getText$();
    }
}
