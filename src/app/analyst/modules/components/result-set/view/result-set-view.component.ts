import { Component, Input } from "@angular/core";
import { ResultSet } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-set-view",
    templateUrl: "./result-set-view.component.html",
    styleUrls: ["./result-set-view.component.scss"]
})
export class ResultSetViewComponent {
    @Input() resultSet: ResultSet | undefined;
    @Input() orgConfigType: string | undefined;
}
