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

    // number of outstanding show() calls; the spinner is hidden only when all of them have been matched by hide()
    private _pending: number = 0;

    show(text?: string) {
        if (text) this.textSubscriber.next(text);
        this._pending++;
        this.ngxSpinnerService.show();
    }

    updateProgress(progressText: string | undefined) {
        this.progressSubscriber.next(progressText);
    }

    hide() {
        this._pending = Math.max(0, this._pending - 1);
        if (this._pending === 0) this.ngxSpinnerService.hide();
    }

    getProgress$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.progressSubscriber = subscriber));
    }

    getText$(): Observable<string> {
        return new Observable<string>((subscriber) => (this.textSubscriber = subscriber));
    }
}
