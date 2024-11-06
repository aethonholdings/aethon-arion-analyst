import { Component, Input } from "@angular/core";
import { StateType } from "aethon-arion-pipeline";

@Component({
    selector: "arion-status-indicator",
    templateUrl: "./status-indicator.component.html",
    styleUrls: ["./status-indicator.component.scss"]
})
export class StatusIndicatorComponent {
    @Input() status: StateType | undefined;
    icon: string = "";
    color: string = "black";
    icons = {
        running: "&#x1F3C3;",
        pending: "&#x1F55C",
        completed: "&#x1F91D;",
        failed: "&#x1F641;"
    };
    colours = {
        running: "green",
        pending: "black",
        completed: "black",
        failed: "red"
    };

    ngOnInit() {
        if (this.status) {
            this.icon = this.icons[this.status];
            this.color = "color:" + this.colours[this.status];
        }
    }
}
