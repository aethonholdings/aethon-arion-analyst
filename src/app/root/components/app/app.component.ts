import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    standalone: false,
    selector: "arion-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    title = "aethon-arion-analyst";
}
