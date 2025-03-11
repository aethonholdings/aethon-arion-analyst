import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { SimSetDTO } from "aethon-arion-pipeline";
import { Views } from "../../../constants/analyst.constants";

@Component({
    selector: "arion-sim-set",
    templateUrl: "./sim-set.component.html",
    styleUrls: ["./sim-set.component.scss"]
})
export class SimSetComponent {
    @Input() data!: SimSetDTO | SimSetDTO[]; // Parent passes data down
    @Input() view!: string; // Parent decides the view mode
    @Output() dataChange = new EventEmitter<SimSetDTO | SimSetDTO[]>(); // To update parent
    @Output() selected = new EventEmitter<number>(); // To notify parent of selection

    views = Views;

    get dataArray(): SimSetDTO[] {
        return this.data as SimSetDTO[];
    }

    get dataInstance(): SimSetDTO {
        return this.data as SimSetDTO;
    }

    set dataInstance(data: SimSetDTO) {
        this.data = data;
        this.dataChange.emit(data); // Emit updated data to parent
    }
}
