import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { C1Service } from "../../services/c1.service";
import { OptimiserParameters, SimSetDTO } from "aethon-arion-pipeline";
import { C1OptimiserNames } from "aethon-arion-c1";

@Component({
    selector: "arion-c1-sim-set",
    templateUrl: "./c1-sim-set.component.html",
    styleUrls: ["./c1-sim-set.component.scss"]
})
export class C1SimSetComponent implements OnInit {
    @Input() simSet!: SimSetDTO;
    @Output() simSetChange: EventEmitter<SimSetDTO> = new EventEmitter<SimSetDTO>();
    optimisers!: {
        name: string;
        defaults: OptimiserParameters;
    }[];
    selected!: string;
    c1OptimiserNames = C1OptimiserNames;

    constructor(private c1Service: C1Service) {}

    ngOnInit(): void {
        this.optimisers = this.c1Service.getOptimisers();
        this.selected = C1OptimiserNames.GRADIENT_ASCENT;
        this.onSelect();
    }

    onSelect() {
        let optimiser = this.optimisers.find((optimiser) => this.selected === optimiser.name);
        if(optimiser) this.simSet.optimiserParams = optimiser.defaults;
    }
}
