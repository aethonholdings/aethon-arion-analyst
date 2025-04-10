import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subscriber } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SpinnerService {
    progressSubscriber: Subscriber<string> = new Subscriber<string>();
    textSubscriber: Subscriber<string> = new Subscriber<string>();

    constructor(private ngxSpinnerService: NgxSpinnerService) {}

    show(text?: string) {
        if (text) this.textSubscriber.next(text);
        this.ngxSpinnerService.show();
    }

    updateProgress(progressText: string | undefined) {
        this.progressSubscriber.next(progressText);
    }

    hide() {
        this.ngxSpinnerService.hide();
    }

    getProgress$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.progressSubscriber = subscriber));
    }

    getText$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.textSubscriber = subscriber));
    }
}
