import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

export interface Breadcrumb {
    label: string;
    route?: string[];
    queryParams?: { [key: string]: string };
}

@Component({
    standalone: false,
    selector: "arion-breadcrumbs",
    templateUrl: "./breadcrumbs.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./breadcrumbs.component.scss"]
})
export class BreadcrumbsComponent {
    @Input() breadcrumbs: Breadcrumb[] = [];
}
