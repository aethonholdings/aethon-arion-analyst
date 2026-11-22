import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from "@angular/core";
import { SimConfigDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";

@Component({
    standalone: false,
    selector: "arion-sim-config",
    templateUrl: "./sim-config.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
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
