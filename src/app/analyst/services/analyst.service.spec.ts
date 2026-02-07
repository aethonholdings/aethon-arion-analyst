import { TestBed } from "@angular/core/testing";
import { AnalystService } from "./analyst.service";
import { ApiService } from "src/app/root/services/api.service";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";
import { of } from "rxjs";

describe("AnalystService", () => {
    let service: AnalystService;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

    beforeEach(() => {
        const apiSpy = jasmine.createSpyObj("ApiService", ["setAPI", "request$"]);
        const spinnerSpy = jasmine.createSpyObj("SpinnerService", ["start", "stop", "updateProgressText"]);

        TestBed.configureTestingModule({
            providers: [
                AnalystService,
                { provide: ApiService, useValue: apiSpy },
                { provide: SpinnerService, useValue: spinnerSpy }
            ]
        });

        service = TestBed.inject(AnalystService);
        apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
        spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should initialize API in constructor", () => {
        expect(apiServiceSpy.setAPI).toHaveBeenCalled();
    });

    it("should return refresh timer observable", (done) => {
        const timer$ = service.getRefeshTimer$();
        expect(timer$).toBeTruthy();

        timer$.subscribe((value) => {
            expect(typeof value).toBe("number");
            done();
        });
    });

    it("should get SimSets", (done) => {
        const mockSimSets = [
            { id: 1, name: "Test SimSet" }
        ];

        // ApiService.request$ returns the payload directly, not wrapped
        apiServiceSpy.request$.and.returnValue(of(mockSimSets));

        service.getSimSets$().subscribe((simSets: any) => {
            expect(simSets).toEqual(mockSimSets);
            done();
        });
    });

    it("should get SimSet by id", (done) => {
        const mockSimSet = { id: 1, name: "Test SimSet" };

        // ApiService.request$ returns the payload directly, not wrapped
        apiServiceSpy.request$.and.returnValue(of(mockSimSet));

        service.getSimSet$(1).subscribe((simSet: any) => {
            expect(simSet.id).toBe(1);
            expect(simSet.name).toBe("Test SimSet");
            done();
        });
    });

    it("should get OrgConfig by id", (done) => {
        const mockOrgConfig = { id: 1, type: "test" };

        // ApiService.request$ returns the payload directly, not wrapped
        apiServiceSpy.request$.and.returnValue(of(mockOrgConfig));

        service.getOrgConfig$(1).subscribe((orgConfig: any) => {
            expect(orgConfig.id).toBe(1);
            done();
        });
    });
});
