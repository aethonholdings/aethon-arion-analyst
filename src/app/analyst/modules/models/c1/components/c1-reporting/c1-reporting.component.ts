import { Component, Input } from "@angular/core";

@Component({
    selector: "arion-c1-reporting",
    templateUrl: "./c1-reporting.component.html",
    styleUrls: ["./c1-reporting.component.scss"]
})
export class C1ReportingComponent {
    @Input() reportingDTO: any;
}
