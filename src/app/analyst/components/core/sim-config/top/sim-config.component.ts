import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    selector: "arion-sim-config",
    templateUrl: "./sim-config.component.html",
    styleUrls: ["./sim-config.component.scss"]
})
export class SimConfigComponent {
    @Input() dataArray!: SimConfigDTO[];
    @Input() dataInstance!: SimConfigDTO;
    @Input() view!: string;
    @Output() dataArrayChange = new EventEmitter<SimConfigDTO[]>();
    @Output() dataInstanceChange = new EventEmitter<SimConfigDTO>();
    @Output() selected = new EventEmitter<number>();

    views = Views;
}
