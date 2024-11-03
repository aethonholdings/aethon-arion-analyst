import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { API, APIRequest, APIRequestOptions, APIResponseData } from "aethon-api-types";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    private _api: API | undefined;

    constructor(private httpService: HttpService) {}

    setAPI(api: any): void {
        this._api = api;
    }

    request$<T>(operation: string, options: APIRequestOptions = {}, disableUI: boolean = true): Observable<T> {
        if (!this._api) throw new Error("API specification not set");
        const request: APIRequest | undefined = this._api?.getRequest(operation, options);
        if (!request) throw new Error(`${operation} operation endpoint not found in API schema`);
        return this.httpService
            .requestNew$<T>(request, disableUI)
            .pipe(map((response: APIResponseData<T>) => response.payload as T));
    }
}
