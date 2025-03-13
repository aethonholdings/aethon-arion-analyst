import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subscriber } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SpinnerService {
    textSubscriber: Subscriber<string> = new Subscriber<string>();

    constructor(private ngxSpinnerService: NgxSpinnerService) {}

    show() {
        this.ngxSpinnerService.show();
    }

    updateProgress(text: string | undefined) {
        this.textSubscriber.next(text);
    }

    hide() {
        this.ngxSpinnerService.hide();
    }

    getProgress$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.textSubscriber = subscriber));
    }
}
