import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrgConfigDTO } from "aethon-arion-pipeline";
import { Observable } from "rxjs";
import { Views } from "src/app/analyst/constants/analyst.constants";
import { AnalystService } from "src/app/analyst/services/analyst.service";

@Component({
    selector: "arion-org-config-view-container",
    templateUrl: "./org-config-view-container.component.html",
    styleUrls: ["./org-config-view-container.component.scss"]
})
export class OrgConfigViewContainerComponent {
    orgConfig$!: Observable<OrgConfigDTO>;
    views = Views;

    constructor(
        private activatedRoute: ActivatedRoute,
        private analystService: AnalystService
    ) {
        const id: number = this.activatedRoute.snapshot.paramMap.get("id") as unknown as number;
        this.orgConfig$ = this.analystService.getOrgConfig$(id);
    }
}
