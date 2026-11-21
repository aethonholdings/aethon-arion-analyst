import { C1 } from "aethon-arion-c1";
import { c1GradientAscentDefaultOptimiserParams } from "./analyst-c1.constants";

describe("C1 analyst defaults", () => {
    it("pass the C1 optimiser's parameter validation", () => {
        expect(C1.getDefaultOptimiser().validateParameters(c1GradientAscentDefaultOptimiserParams())).toEqual([]);
    });
});
