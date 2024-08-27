import { Component, Input, OnInit } from "@angular/core";
import { ResultSet } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-set",
    templateUrl: "./result-set.component.html",
    styleUrls: ["./result-set.component.scss"]
})
export class ResultSetComponent {
    @Input() resultSet: ResultSet | undefined;
    @Input() orgConfigType: string | undefined;


}
