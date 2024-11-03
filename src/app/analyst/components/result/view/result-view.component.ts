import { Component, Input } from "@angular/core";
import { ResultDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-result-view",
    templateUrl: "./result-view.component.html",
    styleUrls: ["./result-view.component.scss"]
})
export class ResultViewComponent {
    @Input() result: ResultDTO | undefined;
}
