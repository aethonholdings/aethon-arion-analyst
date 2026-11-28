import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ControlExperimentResult } from "./control-experiment";

type Group = { id: string; status: string; performance?: number; orgConfigCount?: number };

/** The outcome of a control experiment SimSet: both groups, and the paired effect of the control step. */
@Component({
    standalone: false,
    selector: "arion-control-experiment-result",
    templateUrl: "./control-experiment-result.component.html",
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ControlExperimentResultComponent {
    @Input() simSet: any;

    get state(): any {
        return this.simSet?.optimiserStates?.[0] ?? null;
    }

    get required(): number {
        return this.simSet?.optimiserParams?.orgConfigs ?? 0;
    }

    get groups(): Group[] {
        return (this.state?.optimiserData?.dataPoints ?? []).map((p: any) => ({
            id: p.id,
            status: p.status,
            performance: p.data?.outputs?.performance,
            orgConfigCount: p.data?.outputs?.orgConfigCount
        }));
    }

    get result(): ControlExperimentResult | null {
        return this.state?.optimiserData?.result ?? null;
    }

    /** One-line reading of the result. */
    verdict(r: ControlExperimentResult): string {
        const margin = 1.96 * r.standardError;
        if (!r.significant) {
            return `No detectable effect: the step's effect is between ${this._n(r.ci95[0])} and ${this._n(r.ci95[1])} (95%), which includes 0. More org configs would narrow this (±${this._n(margin)} now).`;
        }
        const direction = r.delta < 0 ? "lowers" : "raises";
        return `The control step ${direction} performance by ${this._n(Math.abs(r.delta))} (95% interval ${this._n(r.ci95[0])} to ${this._n(r.ci95[1])}).`;
    }

    private _n(value: number): string {
        const abs = Math.abs(value);
        const digits = abs >= 100 ? 0 : abs >= 1 ? 2 : 4;
        return value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    }
}
