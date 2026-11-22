import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    standalone: false,
    selector: "arion-c1-plant",
    templateUrl: "./c1-plant.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./c1-plant.component.scss"]
})
export class C1PlantComponent {
    @Input() plantDTO: any;
}
