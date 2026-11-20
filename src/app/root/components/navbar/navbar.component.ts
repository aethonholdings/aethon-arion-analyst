import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "arion-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
    isMenuOpen = false;

    constructor(private routerService: Router) {}

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

}
