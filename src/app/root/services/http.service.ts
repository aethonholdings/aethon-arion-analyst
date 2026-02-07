import { Injectable } from "@angular/core";
import { catchError, map, Observable, share, tap } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpMethod, APIRequest } from "aethon-api-types";
import { APIResponse, APIResponseData } from "aethon-api-types";
import * as qs from "qs";
import { environment } from "src/env/environment";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    private _debug: boolean = environment.debug;
    private _headers: HttpHeaders = new HttpHeaders();

    constructor(private httpClient: HttpClient) {}

    request$<T>(request: APIRequest): Observable<APIResponseData<T>> {
        let url = request.getURL();
        let query: string = "";
        // Add query parameters, serialised
        if (request.options?.query) {
            query = qs.stringify(request.options.query, { arrayFormat: "indices" });
            url += `?${query}`;
        }
        // get the correct method
        const method = Object.keys(HttpMethod).find(
            (key) => HttpMethod[key as keyof typeof HttpMethod] === request.endpoint.method
        );
        if (!method) {
            throw new Error(`Method ${request.endpoint.method} not supported`);
        }
        // create the request object
        const json$: Observable<any> = this.httpClient.request(method, url, {
            body: request.options?.body,
            headers: this._headers,
            observe: "response"
        });
        // log the request in the console if debugging
        if (this._debug) {
            console.log({
                event: "REQUEST",
                url: url,
                headers: this._headers,
                options: request.options
            });
        }
        return json$.pipe(
            tap((response) => {
                if (this._debug) {
                    console.log({
                        event: "RESPONSE",
                        statusCode: response.status,
                        response: response.body
                    });
                }
            }),
            map((response) => {
                const body: APIResponse<T> = response.body as APIResponse<T>;
                if (body.success) return body as APIResponseData<T>;
                throw new Error(JSON.stringify(body));
            }),
            share(),
            catchError((error) => {
                if (this._debug) {
                    console.error({
                        source: "API",
                        event: "ERROR",
                        error: error
                    });
                }
                throw error;
            })
        );
    }
}
