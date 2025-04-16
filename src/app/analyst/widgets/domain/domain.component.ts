import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
    selector: "arion-domain",
    templateUrl: "./domain.component.html",
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
                    let found = this.values.categories.find((valueCategory) => valueCategory === category);
                    if (found) optimise = true;
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
        if (
            (this.values.type === this.domainTypes.CONTINUOUS &&
                this.definition.domain.type === this.domainTypes.CONTINUOUS) ||
            (this.definition.domain.type === this.domainTypes.DISCRETE &&
                this.values.type === this.domainTypes.DISCRETE)
        ) {
            if (this.values.optimise) {
                if (this.values.max < this.values.min)
                    this.modalText += `<p>Max value must be greater than min value<p>`;
                if (this.values.derivativeStepSize > this.values.max - this.values.min)
                    this.modalText += `<p>Domain derivative step size must be smaller than interval between max and min</p>`;
                if (!this.modalText) {
                    if (this.values.type === this.domainTypes.DISCRETE) {
                        this.values.max = Math.round(this.values.max);
                        this.values.min = Math.round(this.values.min);
                        this.values.derivativeStepSize = Math.round(this.values.derivativeStepSize);
                    }
                    this.values = {
                        type: this.definition.domain.type,
                        optimise: true,
                        max: this.values.max || this.definition.domain.max,
                        min: this.values.min || this.definition.domain.min,
                        derivativeStepSize: this.values.derivativeStepSize || this.definition.domain.derivativeStepSize
                    };
                }
            } else {
                this.values = {
                    type: this.definition.domain.type,
                    optimise: false,
                    default: this.values.default || this.definition.domain.default
                };
            }
        }
        if (
            this.values.type === this.domainTypes.CATEGORICAL &&
            this.definition.domain.type === this.domainTypes.CATEGORICAL
        ) {
            if (this.values.optimise) {
                if (this.selectionFlags.filter((flags) => flags[0]).length < 2)
                    this.modalText += `<p>Optimisation requires two or more categories</p>`;
            } else {
                this.values = {
                    type: this.definition.domain.type,
                    optimise: false,
                    default: this.values.default || this.definition.domain.default
                };
            }
        }
        if (this.modalText) {
            this.ok = false;
        } else {
            this.ok = true;
            this.valuesChange.emit(this.values);
        }
        this.check.emit(this.ok);
    }

    $clickInclusive(category: string) {
        if (this.values.optimise) {
            if (
                this.definition.domain.type === DomainTypes.CATEGORICAL &&
                this.values.type === DomainTypes.CATEGORICAL
            ) {
                let found = this.values.categories.find((categoryValue) => categoryValue === category);
                found
                    ? (this.values.categories = this.values.categories.filter(
                          (categoryValue) => categoryValue !== category
                      ))
                    : this.values.categories.push(category);
            }
        }
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
