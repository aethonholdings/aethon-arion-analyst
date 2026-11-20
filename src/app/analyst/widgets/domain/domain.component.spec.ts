import { DomainTypes } from "aethon-arion-pipeline";
import { DomainComponent } from "./domain.component";

describe("DomainComponent", () => {
    const categorical = () => {
        const c = new DomainComponent();
        c.definition = {
            id: "graph",
            domain: { type: DomainTypes.CATEGORICAL, default: "teams", categories: ["teams", "top-down", "flat"] }
        };
        c.values = { type: DomainTypes.CATEGORICAL, optimise: false, default: "teams" } as any;
        c.ngOnInit();
        return c;
    };
    const numeric = (values: any) => {
        const c = new DomainComponent();
        c.definition = {
            id: "gains.judgment",
            domain: { type: DomainTypes.CONTINUOUS, min: 0, max: 1, default: 0.5, derivativeStepSize: 0.1 }
        };
        c.values = { type: DomainTypes.CONTINUOUS, ...values };
        c.ngOnInit();
        return c;
    };

    it("builds the category list when optimisation is switched on", () => {
        const c = categorical();
        (c.values as any).optimise = true;
        expect(() => c.$check()).not.toThrow();
        expect((c.values as any).categories).toEqual(["teams", "top-down", "flat"]);
        c.selectionFlags[2][0] = false;
        c.$clickInclusive("flat");
        expect((c.values as any).categories).toEqual(["teams", "top-down"]);
        expect(c.ok).toBe(true);
        c.selectionFlags[1][0] = false;
        c.$clickInclusive("top-down");
        expect(c.ok).toBe(false);
    });

    it("keeps a default of 0 instead of replacing it", () => {
        const c = numeric({ optimise: false, default: 0 });
        c.$check();
        expect((c.values as any).default).toBe(0);
    });

    it("flags min above max and a non-positive step size", () => {
        let c = numeric({ optimise: true, min: 2, max: 1, derivativeStepSize: 0.1 });
        c.$check();
        expect(c.ok).toBe(false);
        c = numeric({ optimise: true, min: 0, max: 1, derivativeStepSize: 0 });
        c.$check();
        expect(c.ok).toBe(false);
        c = numeric({ optimise: true, min: 0, max: 1, derivativeStepSize: 0.1 });
        c.$check();
        expect(c.ok).toBe(true);
    });
});
