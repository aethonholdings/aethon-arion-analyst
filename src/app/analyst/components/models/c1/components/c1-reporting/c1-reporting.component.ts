import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    standalone: false,
    selector: "arion-c1-reporting",
    templateUrl: "./c1-reporting.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./c1-reporting.component.scss"]
})
export class C1ReportingComponent {
    @Input() reportingDTO: any;
}
