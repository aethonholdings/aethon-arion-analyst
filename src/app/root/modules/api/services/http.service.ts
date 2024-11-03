import { Injectable } from "@angular/core";
import { catchError, concatMap, finalize, map, Observable, of, share, switchMap, tap } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { APIEndpoint, APIHost, APIRequestOptions, HttpMethod, APIRequest } from "aethon-api-types";
import { environment } from "src/env/environment";
import { APIResponse, APIResponseData } from "aethon-api-types";
import { SpinnerService } from "../../app-container/services/spinner.service";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    private _debug: boolean = true;
    private _headers: HttpHeaders = new HttpHeaders();
    private _host: APIHost;
    private _baseUrl: string;

    constructor(
        private httpClient: HttpClient,
        private spinnerService: SpinnerService
    ) {
        const host = environment.host;
        if (host.basePath) host.basePath = host.basePath.replace("/", "");
        host.name = host?.name.replace("/", "").replace(":", "");
        this._host = host;
        this._baseUrl = `${this._host.protocol}://${this._host.name}`;
        if (this._host?.port) this._baseUrl = `${this._baseUrl}:${this._host.port}`;
        if (this._host?.basePath) this._baseUrl = `${this._baseUrl}/${this._host.basePath}/`;
        if (environment?.debug) this._debug = environment.debug;
    }

    requestNew$<T>(request: APIRequest, disableUI: boolean = true): Observable<APIResponseData<T>> {
        const url = request.getURL();
        let json$: Observable<any>;

        switch (request.endpoint.method) {
            case HttpMethod.GET:
                json$ = this._get$(url, request.options);
                break;
            case HttpMethod.POST:
                json$ = this._post$(url, request.options);
                break;
            case HttpMethod.PATCH:
                json$ = this._patch$(url, request.options);
                break;
            case HttpMethod.DELETE:
                json$ = this._delete$(url, request.options);
                break;
            default:
                throw new Error(`Method ${request.endpoint.method} not supported`);
        }

        return of(disableUI ? this.spinnerService.show() : null).pipe(
            switchMap(() => json$),
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
            }),
            finalize(() => (disableUI ? this.spinnerService.hide() : of(null)))
        );
    }

    request$<T>(endpoint: APIEndpoint, disableUI: boolean = true, options: APIRequestOptions = {}): Observable<any> {
        let json$: Observable<any> = new Observable<any>();
        const url: string = this._baseUrl + endpoint.path;

        switch (endpoint.method) {
            case HttpMethod.GET:
                json$ = this._get$(url, options);
                break;
            case HttpMethod.POST:
                json$ = this._post$(url, options);
                break;
            case HttpMethod.PATCH:
                json$ = this._patch$(url, options);
                break;
            case HttpMethod.DELETE:
                json$ = this._delete$(url, options);
                break;
        }

        return of(disableUI ? this.spinnerService.show() : null).pipe(
            switchMap(() => json$),
            concatMap((response) => {
                if (this._debug) {
                    console.log({
                        event: "RESPONSE",
                        statusCode: response.status,
                        response: response.body
                    });
                }
                return of(response);
            }),
            map((response) => {
                const body = response.body as APIResponse<T>;
                if (body.success) return body as APIResponseData<T>;
                throw new Error(JSON.stringify(body));
            }),
            catchError((error) => {
                if (this._debug) {
                    console.error({
                        source: "API",
                        event: "ERROR",
                        error: error
                    });
                }
                throw error;
            }),
            finalize(() => (disableUI ? this.spinnerService.hide() : of(null)))
        );
    }

    private _get$(url: string, options: APIRequestOptions | undefined) {
        this._logRequest(url, options?.params);
        return this.httpClient.get(url, {
            params: options?.query,
            headers: this._headers,
            observe: "response"
        });
    }

    private _post$(url: string, options: APIRequestOptions | undefined) {
        this._logRequest(url, options?.body);
        return this.httpClient.post(url, options?.body, {
            headers: this._headers,
            observe: "response"
        });
    }

    private _delete$(url: string, options: APIRequestOptions | undefined) {
        this._logRequest(url, options?.params);
        return this.httpClient.delete(url, {
            headers: this._headers,
            observe: "response"
        });
    }

    private _patch$(url: string, options: APIRequestOptions | undefined) {
        this._logRequest(url, options?.params);
        return this.httpClient.patch(url, options?.params, {
            headers: this._headers,
            observe: "response"
        });
    }

    private _logRequest(url: string, options: APIRequestOptions | undefined) {
        if (this._debug) {
            console.log({
                event: "REQUEST",
                url: url,
                headers: this._headers,
                options: options || null
            });
        }
    }
}
