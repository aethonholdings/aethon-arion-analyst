import { TestBed } from "@angular/core/testing";

import { AnalystModelsService } from "./analyst-models.service";

describe("AnalystModelsService", () => {
    let service: AnalystModelsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AnalystModelsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
