import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { API, APIRequest, APIRequestOptions, APIResponse, APIResponseData } from "aethon-api-types";
import { concatMap, from, map, mergeMap, Observable, of } from "rxjs";
import { ProgressState } from "../types/root.types";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    private _api: API | undefined;

    constructor(private httpService: HttpService) {}

    setAPI(api: any): void {
        this._api = api;
    }

    request$<T>(operation: string, options: APIRequestOptions = {}): Observable<T> {
        return this.requestRaw$<T>(operation, options).pipe(
            map((response: APIResponseData<T>) => response.payload as T)
        );
    }

    fetchAllPaginated$<T>(operation: string, options: APIRequestOptions = {}): Observable<ProgressState<T>> {
        options.query = { ...options.query, page: 1 };
        let itemCount: number = 0;
        let totalItems: number = 0;
        return this.requestRaw$<T>(operation, options).pipe(
            mergeMap((response: APIResponseData<T>) => {
                const requests: Observable<APIResponseData<T>>[] = [];
                if (response.paginated) {
                    requests.push(of(response));
                    for (let i = 2; i <= response.payload.meta.totalPages; i++) {
                        options.query = { ...options.query, page: i };
                        requests.push(this.requestRaw$<T>(operation, options));
                    }
                } else {
                    throw new Error("API response is not paginated");
                }
                return from(requests);
            }),
            concatMap((request: Observable<APIResponseData<T>>) => request),
            map((response: APIResponseData<T>) => {
                if (response.paginated) {
                    itemCount += response.payload.data.length;
                    totalItems = response.payload.meta.totalItems;
                    return {
                        progressPercent: Math.round((itemCount / totalItems) * 100),
                        data: response.payload.data as T
                    };
                } else {
                    throw new Error("API response is not paginated");
                }
            })
            // downstream will need to figure out how to treat the results
        );
    }

    requestRaw$<T>(operation: string, options: APIRequestOptions = {}): Observable<APIResponseData<T>> {
        if (!this._api) throw new Error("API specification not set");
        const request: APIRequest | undefined = this._api?.getRequest(operation, options);
        if (!request) throw new Error(`${operation} operation endpoint not found in API schema`);
        return this.httpService.request$<T>(request).pipe(
            map((response: APIResponse<T>) => {
                if (response.success) return response as APIResponseData<T>;
                else throw new Error("API request failed");
            })
        );
    }
}
