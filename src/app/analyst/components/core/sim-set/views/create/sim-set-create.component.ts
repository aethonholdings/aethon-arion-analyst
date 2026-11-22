import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from "@angular/core";
import { C1ModelName } from "aethon-arion-c1";
import { SimSetDTO } from "aethon-arion-pipeline";
import { ModelService } from "src/app/analyst/services/model.service";

@Component({
    standalone: false,
    selector: "arion-sim-set-create",
    templateUrl: "./sim-set-create.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./sim-set-create.component.scss"]
})
export class SimSetCreateComponent implements OnInit {
    @Input() simSet!: SimSetDTO;
    @Output() simSetChange: EventEmitter<SimSetDTO> = new EventEmitter<SimSetDTO>();
    models!: string[];
    selected!: string;

    constructor(private modelService: ModelService) {}

    ngOnInit(): void {
        this.models = this.modelService.getModels().map((model) => model.name);
        if (this.models.length > 0) {
            this.selected = this.models[0];
        } else {
            throw new Error("No models configured");
        }
        this.simSet.modelName = C1ModelName;
    }
}
