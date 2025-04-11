import { Component, Input } from "@angular/core";
import { C1ConfiguratorParamData } from "aethon-arion-c1";
import { OptimiserStateDTO } from "aethon-arion-pipeline";

@Component({
    selector: "arion-c1-optimiser-state",
    templateUrl: "./c1-optimiser-state.component.html",
    styleUrls: ["./c1-optimiser-state.component.scss"]
})
export class C1OptimiserStateComponent {
    @Input() optimiserState!: OptimiserStateDTO<C1ConfiguratorParamData>;
}
