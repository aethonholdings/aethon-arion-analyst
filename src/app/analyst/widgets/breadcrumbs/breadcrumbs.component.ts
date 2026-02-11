import { Component, Input } from '@angular/core';

export interface Breadcrumb {
    label: string;
    route?: string[];
}

@Component({
    selector: 'arion-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
    @Input() breadcrumbs: Breadcrumb[] = [];
}
