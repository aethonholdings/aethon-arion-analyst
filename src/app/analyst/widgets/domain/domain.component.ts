import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from "@angular/core";
import { Domain, DomainTypes } from "aethon-arion-pipeline";

export type DomainDefinition = {
    id: string;
    domain:
        | {
              type: DomainTypes.CONTINUOUS | DomainTypes.DISCRETE;
              min: number;
              max: number;
              default: number;
              derivativeStepSize: number;
          }
        | {
              type: DomainTypes.CATEGORICAL;
              default: string;
              categories: string[];
          }
        | {
              default: boolean;
              type: DomainTypes.BOOLEAN;
          };
};

@Component({
    standalone: false,
    selector: "arion-domain",
    templateUrl: "./domain.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./domain.component.scss"]
})
export class DomainComponent implements OnInit {
    @Input() values!: Domain;
    @Output() valuesChange: EventEmitter<Domain> = new EventEmitter<Domain>();
    @Output() check: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() definition!: DomainDefinition;
    @Input() readonly: boolean = true;

    domainTypes = DomainTypes;
    optimise: boolean = false;
    ok: boolean = true;
    modalText!: string;
    selectionFlags: boolean[][] = [];

    ngOnInit(): void {
        if (this.definition.domain.type === DomainTypes.CATEGORICAL && this.values.type === DomainTypes.CATEGORICAL) {
            for (let i = 0; i < this.definition.domain.categories.length; i++) {
                const category: string = this.definition.domain.categories[i];
                let optimise: boolean = false,
                    defaultValue: boolean = false;
                if (this.values.optimise) {
                    optimise = (this.values.categories ?? []).includes(category);
                }
                if (category === this.definition.domain.default) defaultValue = true;
                this.selectionFlags.push([optimise, defaultValue]);
            }
        } else if (this.definition.domain.type === DomainTypes.BOOLEAN && this.values.type === DomainTypes.BOOLEAN) {
            this.selectionFlags = [
                [true, this.definition.domain.default],
                [true, !this.definition.domain.default]
            ];
        }
    }

    $check() {
        this.ok = true;
        this.modalText = "";
        if (this.values.type !== this.definition.domain.type)
            throw new Error(`DomainComponent: Incompatible domain type for parameter ${this.definition.id}`);
        const definition = this.definition.domain;
        if (
            (definition.type === DomainTypes.CONTINUOUS || definition.type === DomainTypes.DISCRETE) &&
            (this.values.type === DomainTypes.CONTINUOUS || this.values.type === DomainTypes.DISCRETE)
        ) {
            if (this.values.optimise) {
                // ?? rather than ||: a value of 0 is a legitimate entry, only an empty field takes the default
                const values: any = this.values;
                let min: number = values.min ?? definition.min;
                let max: number = values.max ?? definition.max;
                let step: number = values.derivativeStepSize ?? definition.derivativeStepSize;
                if (this.values.type === DomainTypes.DISCRETE) {
                    min = Math.round(min);
                    max = Math.round(max);
                    step = Math.round(step);
                }
                if (![min, max, step].every((v) => Number.isFinite(v)))
                    this.modalText += `<p>Enter numbers for min, max and step size</p>`;
                if (max < min) this.modalText += `<p>Max value must not be less than min value</p>`;
                if (max > min && !(step > 0)) this.modalText += `<p>Derivative step size must be positive</p>`;
                if (max > min && step > max - min)
                    this.modalText += `<p>Derivative step size must not exceed the interval between max and min</p>`;
                this.values = {
                    type: definition.type,
                    optimise: true,
                    max: max,
                    min: min,
                    derivativeStepSize: step
                };
            } else {
                this.values = {
                    type: definition.type,
                    optimise: false,
                    default: (this.values as any).default ?? definition.default
                };
            }
        }
        if (definition.type === DomainTypes.CATEGORICAL && this.values.type === DomainTypes.CATEGORICAL) {
            if (this.values.optimise) {
                // the categories array is rebuilt from the selection flags: toggling optimise on creates a values
                // object without categories
                if (!this.selectionFlags.some((flags) => flags[0])) {
                    this.selectionFlags.forEach((flags) => (flags[0] = true));
                }
                this.values = {
                    type: definition.type,
                    optimise: true,
                    categories: definition.categories.filter((_, i) => this.selectionFlags[i]?.[0])
                };
                if (this.values.categories.length < 2)
                    this.modalText += `<p>Optimisation requires two or more categories</p>`;
            } else {
                this.values = {
                    type: definition.type,
                    optimise: false,
                    default: (this.values as any).default ?? definition.default
                };
            }
        }
        if (definition.type === DomainTypes.BOOLEAN && this.values.type === DomainTypes.BOOLEAN) {
            this.values = this.values.optimise
                ? { type: definition.type, optimise: true }
                : {
                      type: definition.type,
                      optimise: false,
                      default: (this.values as any).default ?? definition.default
                  };
        }
        this.ok = !this.modalText;
        // always propagate: the parent validates the whole parameter space before submitting
        this.valuesChange.emit(this.values);
        this.check.emit(this.ok);
    }

    $clickInclusive(category: string) {
        // selectionFlags[i][0] is bound with ngModel; $check rebuilds values.categories from it
        this.$check();
    }

    $clickDefault(index: number) {
        if (
            !this.values.optimise &&
            (this.definition.domain.type === DomainTypes.CATEGORICAL ||
                this.definition.domain.type === DomainTypes.BOOLEAN)
        ) {
            for (let i = 0; i < this.selectionFlags.length; i++) {
                if (i === index) {
                    this.selectionFlags[i][1] = true;
                    if (this.definition.domain.type === DomainTypes.CATEGORICAL)
                        this.values.default = this.definition.domain.categories[index];
                    if (this.definition.domain.type === DomainTypes.BOOLEAN)
                        this.values.default = i === 0 ? true : false;
                } else this.selectionFlags[i][1] = false;
            }
        }
        this.$check();
    }
}
