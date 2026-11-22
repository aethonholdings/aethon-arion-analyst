import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    standalone: false,
    selector: "arion-c1-board",
    templateUrl: "./c1-board.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./c1-board.component.scss"]
})
export class C1BoardComponent {
    @Input() boardDTO: any;
}
