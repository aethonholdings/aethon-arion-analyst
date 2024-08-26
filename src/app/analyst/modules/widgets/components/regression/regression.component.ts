import { Component, Input } from "@angular/core";

@Component({
    selector: "arion-regression",
    templateUrl: "./regression.component.html",
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
