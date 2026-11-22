import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    standalone: false,
    selector: "arion-navbar",
    templateUrl: "./navbar.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
    isMenuOpen = false;

    constructor(private routerService: Router) {}

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
