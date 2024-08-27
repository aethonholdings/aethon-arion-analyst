import { Component, Input } from "@angular/core";
import { C1BoardConfig } from "aethon-arion-c1/interfaces/c1.model.interfaces";

@Component({
    selector: "arion-c1-board",
    templateUrl: "./c1-board.component.html",
    styleUrls: ["./c1-board.component.scss"]
})
export class C1BoardComponent {
    @Input() boardDTO: any;
}
