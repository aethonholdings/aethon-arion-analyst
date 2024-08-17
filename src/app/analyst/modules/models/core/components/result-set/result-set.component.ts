import { Component, Input, OnInit } from "@angular/core";
import { ResultSet } from "aethon-arion-pipeline";
import { C1ResultSet } from "aethon-arion-c1";

@Component({
    selector: "arion-result-set",
    templateUrl: "./result-set.component.html",
    styleUrls: ["./result-set.component.scss"]
})
export class ResultSetComponent implements OnInit {
    @Input() resultSet: ResultSet | undefined;
    @Input() orgConfigType: string | undefined;

    mappedResultSet: C1ResultSet | undefined;

    ngOnInit(): void {
        if (this.resultSet) {
            if (this.orgConfigType === "C1") {
                this.mappedResultSet = new C1ResultSet(
                    this.resultSet.getResults(),
                    this.resultSet.getHistogramBinCount()
                );
            }
        }
    }
}
