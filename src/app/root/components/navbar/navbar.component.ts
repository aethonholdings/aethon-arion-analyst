import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "arion-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
    constructor(private routerService: Router) {}

    onChange$(selectedConfiguration: string): void {
        this.routerService.navigate(["/sim-configs"], { queryParams: { configurator: selectedConfiguration } });
    }
}
