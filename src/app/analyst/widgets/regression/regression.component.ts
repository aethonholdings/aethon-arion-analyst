import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    standalone: false,
    selector: "arion-regression",
    templateUrl: "./regression.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./regression.component.scss"]
})
export class RegressionComponent {
    @Input() x: number[][] | undefined;
    @Input() y: number[][] | undefined;
    regression:
        | {
              regressionResults: any;
              inputVariableNames: string[];
              outputVariableNames: string[];
          }
        | undefined;
}
