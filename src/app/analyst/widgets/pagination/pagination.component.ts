import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Paginated } from "aethon-paginate-types";

@Component({
    selector: "arion-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit {
    @Input() pagination: Paginated<any> = {} as Paginated<any>;
    @Output() changePage = new EventEmitter<number>();

    currentPage: number = 1;
    pageArray: number[] = [];
    pagesShown: number = 3;

    ngOnInit(): void {
        this.setPageTags();
    }

    onChanges() {
        this.setPageTags();
    }

    onPrevious() {
        if (this.currentPage !== 1) {
            this.changePage.emit(this.currentPage - 1);
        }
    }

    onNext() {
        if (this.currentPage !== this.pagination.meta.totalPages) {
            this.changePage.emit(this.currentPage + 1);
        }
    }

    onClick(pageNumber: number) {
        this.changePage.emit(pageNumber);
    }

    setPageTags() {
        this.currentPage = this.pagination.meta.currentPage;
        for (
            let i = Math.max(1, Math.min(this.pagination.meta.totalPages - this.pagesShown + 1, this.currentPage - 1));
            i <=
            Math.min(
                Math.max(this.currentPage + this.pagesShown - 2, this.pagesShown),
                this.pagination.meta.totalPages
            );
            i++
        ) {
            this.pageArray.push(i);
        }
    }
}
