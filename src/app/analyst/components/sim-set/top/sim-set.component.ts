import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { Views } from "../../../constants/analyst.constants";

@Component({
    selector: "arion-sim-set",
    templateUrl: "./sim-set.component.html",
    styleUrls: ["./sim-set.component.scss"]
})
export class SimSetComponent {
    @Input() dataArray!: SimSetDTO[];
    @Input() dataInstance!: SimSetDTO;
    @Input() view!: string;
    @Output() dataArrayChange = new EventEmitter<SimSetDTO[]>();
    @Output() dataInstanceChange = new EventEmitter<SimSetDTO>();
    @Output() selected = new EventEmitter<number>(); // To notify parent of selection

    views = Views;
}
