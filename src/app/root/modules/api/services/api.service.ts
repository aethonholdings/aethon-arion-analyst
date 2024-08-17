import { Injectable } from "@angular/core";
import { concatMap, finalize, map, Observable, of, switchMap } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Endpoint, EndpointOptions, Environment } from "aethon-arion-pipeline";
import { environment } from "src/env/environment";
import { SpinnerService } from "../../spinner/services/spinner.service";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    private _debug: boolean = true;
    private _headers: HttpHeaders = new HttpHeaders();
    private _environment: Environment;
    private _baseUrl: string;

    constructor(
        private httpClient: HttpClient,
        private spinnerService: SpinnerService
    ) {
        this._environment = environment.host;
        this._baseUrl = this._environment.hostname;
        if (this._environment?.port) this._baseUrl = this._baseUrl + ":" + this._environment.port;
        if (this._environment?.path) this._baseUrl = this._baseUrl + "/" + this._environment.path;
        if (environment?.debug) this._debug = environment.debug;
    }

    request$(endpoint: Endpoint, disableUI:boolean=true): Observable<any> {
        let json$: Observable<any> = new Observable<any>();
        let url: string = this._baseUrl + endpoint.path;

        switch (endpoint.method) {
            case "GET":
                json$ = this._get$(url, endpoint?.options);
                break;
            case "POST":
                json$ = this._post$(url, endpoint?.options);
                break;
            case "PATCH":
                json$ = this._patch$(url, endpoint?.options);
                break;
            case "DELETE":
                json$ = this._delete$(url, endpoint?.options);
                break;
        }

        return of((disableUI)? this.spinnerService.show() : null).pipe(
            switchMap(() => json$),
            concatMap((response) => {
                if (this._debug) {
                    console.log({
                        event: "RESPONSE",
                        statusCode: response.status,
                        response: response.body
                    });
                }
                return of(response)
            }),
            map((response) => {
                return response.body;
            }),
            finalize(() => (disableUI)? this.spinnerService.hide() : of(null))
        );
    }

    private _get$(url: string, options: EndpointOptions | null) {
        if (options?.id) url = url + options?.id;
        this.logRequest(url, options?.params);
        return this.httpClient.get(url, {
            params: options?.params,
            headers: this._headers,
            observe: "response"
        });
    }

    private _post$(url: string, options: EndpointOptions | null) {
        this.logRequest(url, options?.body);
        return this.httpClient.post(url, options?.body, {
            headers: this._headers,
            observe: "response"
        });
    }

    private _delete$(url: string, options: EndpointOptions | null) {
        if (options?.id) url = url + options?.id;
        this.logRequest(url, options?.params);
        return this.httpClient.delete(url, {
            headers: this._headers,
            observe: "response"
        });
    }

    private _patch$(url: string, options: EndpointOptions | null) {
        if (options?.id) url = url + options?.id;
        this.logRequest(url, options?.params);
        return this.httpClient.patch(url, options?.params, {
            headers: this._headers,
            observe: "response"
        });
    }

    private logRequest(url: string, params: any) {
        if (this._debug) {
            console.log({
                event: "REQUEST",
                url: url,
                headers: this._headers,
                parameters: params
            });
        }
    }
}
