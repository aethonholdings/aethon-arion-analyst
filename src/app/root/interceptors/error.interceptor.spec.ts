import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { ErrorInterceptor } from "./error.interceptor";

describe("ErrorInterceptor", () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ErrorInterceptor,
                    multi: true
                }
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should pass through successful requests", (done) => {
        const testUrl = "/test";
        const mockResponse = { data: "test" };

        httpClient.get(testUrl).subscribe((response) => {
            expect(response).toEqual(mockResponse);
            done();
        });

        const req = httpMock.expectOne(testUrl);
        req.flush(mockResponse);
    });

    it("should handle 401 Unauthorized errors", (done) => {
        const testUrl = "/test";

        httpClient.get(testUrl).subscribe(
            () => fail("should have failed with 401 error"),
            (error: Error) => {
                expect(error.message).toContain("Unauthorized");
                done();
            }
        );

        const req = httpMock.expectOne(testUrl);
        req.flush("Unauthorized", { status: 401, statusText: "Unauthorized" });
    });

    it("should handle 403 Forbidden errors", (done) => {
        const testUrl = "/test";

        httpClient.get(testUrl).subscribe(
            () => fail("should have failed with 403 error"),
            (error: Error) => {
                expect(error.message).toContain("Forbidden");
                done();
            }
        );

        const req = httpMock.expectOne(testUrl);
        req.flush("Forbidden", { status: 403, statusText: "Forbidden" });
    });

    it("should handle 404 Not Found errors", (done) => {
        const testUrl = "/test";

        httpClient.get(testUrl).subscribe(
            () => fail("should have failed with 404 error"),
            (error: Error) => {
                expect(error.message).toContain("Not Found");
                done();
            }
        );

        const req = httpMock.expectOne(testUrl);
        req.flush("Not Found", { status: 404, statusText: "Not Found" });
    });

    it("should handle 500 Internal Server errors", (done) => {
        const testUrl = "/test";

        httpClient.get(testUrl).subscribe(
            () => fail("should have failed with 500 error"),
            (error: Error) => {
                expect(error.message).toContain("Internal Server Error");
                done();
            }
        );

        const req = httpMock.expectOne(testUrl);
        req.flush("Internal Server Error", { status: 500, statusText: "Internal Server Error" });
    });

    it("should handle network errors", (done) => {
        const testUrl = "/test";

        httpClient.get(testUrl).subscribe(
            () => fail("should have failed with network error"),
            (error: Error) => {
                expect(error).toBeTruthy();
                done();
            }
        );

        const req = httpMock.expectOne(testUrl);
        req.error(new ProgressEvent("error"));
    });
});
