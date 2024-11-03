import { Component, Input } from "@angular/core";

@Component({
    selector: "arion-matrix",
    templateUrl: "./matrix.component.html",
    styleUrls: ["./matrix.component.scss"]
})
export class MatrixComponent {
    @Input() matrix: number[][] = [];
    @Input() gain: number = 1;

    constructor() {}

    colour(value: number): string {
        let red = 0,
            green = 0;
        value = this._normalise(value);
        if (value < 0) red = Math.floor(-255 * value);
        else green = Math.floor(255 * value);
        return `rgb(${red}, ${green}, 0)`;
    }

    abs(value: number): number {
        return Math.abs(this._normalise(value));
    }

    private _normalise(value: number): number {
        if (this.gain === 0) return value;
        return value / this.gain;
    }
}
