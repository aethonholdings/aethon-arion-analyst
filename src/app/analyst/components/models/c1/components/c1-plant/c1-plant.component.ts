import { Component, Input } from "@angular/core";

@Component({
    selector: "arion-c1-plant",
    templateUrl: "./c1-plant.component.html",
    styleUrls: ["./c1-plant.component.scss"]
})
export class C1PlantComponent {
    @Input() plantDTO: any;
}
