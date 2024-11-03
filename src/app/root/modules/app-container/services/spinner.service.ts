import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subscriber } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SpinnerService {
    textSubscriber: Subscriber<string> = new Subscriber<string>();

    constructor(private ngxSpinnerService: NgxSpinnerService) {}

    show(text?: string) {
        if (!text) text = "Loading";
        this.ngxSpinnerService.show();
        this.update(text);
    }

    update(text: string) {
        this.textSubscriber.next(text);
    }

    hide() {
        this.ngxSpinnerService.hide();
    }

    getText$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.textSubscriber = subscriber));
    }
}
