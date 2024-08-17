import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-sim-set-create-container",
    templateUrl: "./sim-set-create-container.component.html",
    styleUrls: ["./sim-set-create-container.component.scss"]
})
export class SimSetCreateContainerComponent {
    simSet: SimSetDTO = {} as SimSetDTO;

    constructor(
        private analystService: AnalystService,
        private router: Router
    ) {}

    createSimSet(): void {
        this.analystService.createSimSet$(this.simSet).subscribe((response) => {
            this.router.navigate(["/sim-set", response.id]);
        });
    }
}
