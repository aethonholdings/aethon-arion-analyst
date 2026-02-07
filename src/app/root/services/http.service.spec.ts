import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpService } from "./http.service";
import { APIRequest, HttpMethod } from "aethon-api-types";

describe("HttpService", () => {
    let service: HttpService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpService]
        });
        service = TestBed.inject(HttpService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should make a GET request", (done) => {
        const mockRequest = {
            getURL: () => "http://localhost:3000/test",
            endpoint: { method: HttpMethod.GET },
            options: {}
        } as APIRequest;

        const mockResponse = {
            success: true,
            data: { test: "data" }
        };

        service.request$(mockRequest).subscribe((response: any) => {
            expect(response.success).toBe(true);
            expect(response).toBeTruthy();
            done();
        });

        const req = httpMock.expectOne("http://localhost:3000/test");
        expect(req.request.method).toBe("GET");
        req.flush(mockResponse);
    });

    it("should handle query parameters", (done) => {
        const mockRequest = {
            getURL: () => "http://localhost:3000/test",
            endpoint: { method: HttpMethod.GET },
            options: {
                query: { page: 1, limit: 10 }
            }
        } as APIRequest;

        const mockResponse = {
            success: true,
            data: []
        };

        service.request$(mockRequest).subscribe(() => {
            done();
        });

        const req = httpMock.expectOne((request) => request.url.includes("page"));
        expect(req.request.url).toContain("page");
        req.flush(mockResponse);
    });

    it("should handle errors", (done) => {
        const mockRequest = {
            getURL: () => "http://localhost:3000/test",
            endpoint: { method: HttpMethod.GET },
            options: {}
        } as APIRequest;

        service.request$(mockRequest).subscribe(
            () => fail("should have failed"),
            (error) => {
                expect(error).toBeTruthy();
                done();
            }
        );

        const req = httpMock.expectOne("http://localhost:3000/test");
        req.error(new ProgressEvent("error"));
    });
});
