import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";

@Component({
    selector: "arion-sim-set-create-container",
    templateUrl: "./sim-set-create-container.component.html",
    styleUrls: ["./sim-set-create-container.component.scss"]
})
export class SimSetCreateContainerComponent implements OnInit {
    simSet: SimSetDTO = {} as SimSetDTO;
    views = Views;
    breadcrumbs: Breadcrumb[] = [
        { label: 'SimSets', route: ['/sim-set'] },
        { label: 'Create New SimSet' }
    ];
    isCloning: boolean = false;

    constructor(
        private analystService: AnalystService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        const cloneId = this.activatedRoute.snapshot.queryParamMap.get("cloneId");

        if (cloneId) {
            this.isCloning = true;
            this.breadcrumbs = [
                { label: 'SimSets', route: ['/sim-set'] },
                { label: `Clone SimSet ${cloneId}` }
            ];

            // Load the simSet to clone
            this.analystService.getSimSet$(Number(cloneId)).subscribe((simSet) => {
                // Remove the ID so it creates a new one
                const { id, ...simSetWithoutId } = simSet;

                // Update description to indicate it's a clone
                this.simSet = {
                    ...simSetWithoutId,
                    description: `Clone of SimSet ${cloneId}: ${simSet.description || ''}`,
                    state: 'pending' // Reset state
                } as SimSetDTO;
            });
        }
    }

    createSimSet(): void {
        this.analystService.createSimSet$(this.simSet).subscribe((response) => {
            this.router.navigate(["/sim-set", response.id]);
        });
    }
}
