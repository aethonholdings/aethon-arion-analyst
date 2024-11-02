import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Paginated } from "aethon-paginate-types";

@Component({
    selector: "arion-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit {
    @Input() pagination: Paginated<any> = {} as Paginated<any>;
    @Input() paginationPagesShown: number = 3;
    @Output() changePage = new EventEmitter<number>();

    currentPage: number = 1;
    pageArray: number[] = [];

    ngOnInit(): void {
        this.setPageTags();
    }

    onChanges() {
        this.setPageTags();
    }

    onPrevious() {
        if(this.currentPage !== 1) {
            this.changePage.emit(this.currentPage - 1);
        }
    }

    onNext() {
        if(this.currentPage !== this.pagination.meta.totalPages) {
            this.changePage.emit(this.currentPage + 1);
        }
    }

    onClick(pageNumber: number) {
        this.changePage.emit(pageNumber);
    }

    setPageTags() {
        this.currentPage = this.pagination.meta.currentPage;
        this.pageArray = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        if (this.currentPage === 1) {
            this.pageArray = Array.from({ length: this.paginationPagesShown }, (_, i) => i + 1);
        }
        if (this.pagination.meta.totalPages < this.paginationPagesShown) {
            this.pageArray = Array.from({ length: this.pagination.meta.totalPages }, (_, i) => i + 1);
        }
        if (this.currentPage > this.pagination.meta.totalPages - this.paginationPagesShown) {
            this.pageArray = Array.from(
                { length: this.paginationPagesShown },
                (_, i) => this.pagination.meta.totalPages - this.paginationPagesShown + i + 1
            );
        }
    }
}
