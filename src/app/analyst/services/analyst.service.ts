import { Injectable } from "@angular/core";
import {
    ConfiguratorParamsDTO,
    OrgConfigDTO,
    ResultDTO,
    SimConfigDTO,
    SimSetDTO,
    StateSpace,
    StateSpacePointDTO
} from "aethon-arion-pipeline";
import { Observable, catchError, concatMap, finalize, from, map, of, share, switchMap, timer } from "rxjs";
import { HttpService } from "src/app/root/services/http.service";
import { Paginated, PaginateQuery } from "aethon-paginate-types";
import { API, APIEndpoint, APIRequest, APIRequestOptions, HttpMethod } from "aethon-api-types";
import { environment } from "src/env/environment";
import * as openApi from "../swagger/swagger.json";
import { ApiService } from "src/app/root/services/api.service";
import { SpinnerService } from "src/app/root/services/spinner.service";

@Injectable({
    providedIn: "root"
})
export class AnalystService {
    private _refreshTimer: Observable<number> = timer(0, 10000).pipe(share());

    constructor(
        private apiService: ApiService,
        private httpService: HttpService,
        private spinnerService: SpinnerService
    ) {
        const host = environment.host;
        const api = new API(host.protocol, host.name, openApi, host?.port, host?.basePath);
        this.apiService.setAPI(api);
    }

    getRefeshTimer$(): Observable<number> {
        return this._refreshTimer;
    }

    getSimSets$(disableUI: boolean = true): Observable<SimSetDTO[]> {
        const operation: string = "SimSetController_index";
        return this.apiService.request$<SimSetDTO[]>(operation, {}, disableUI);
    }

    getSimSet$(id: number, disableUI: boolean = true): Observable<SimSetDTO> {
        const operation: string = "SimSetController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<SimSetDTO>(operation, options, disableUI);
    }

    createSimSet$(simSetDTO: SimSetDTO): Observable<SimSetDTO> {
        const endpoint: APIEndpoint = {
            path: `sim-set`,
            method: HttpMethod.POST
        };
        return this.httpService.request$(endpoint);
    }

    deleteSimSet$(id: number): Observable<void> {
        const endpoint: APIEndpoint = {
            path: `sim-set/${id}`,
            method: HttpMethod.DELETE
        };
        return this.httpService.request$(endpoint);
    }

    getSimSetSimConfigs$(simSetId: number, pageNumber: number = 1): Observable<Paginated<SimConfigDTO>> {
        const operation: string = "SimSetController_simConfigs";
        const options: APIRequestOptions = { params: { id: simSetId }, query: { page: pageNumber } as PaginateQuery };
        return this.apiService.request$<Paginated<SimConfigDTO>>(operation, options);
    }

    getSimSetResultSet$(simSetId: number): Observable<Paginated<ResultDTO>> {
        const operation: string = "SimSetController_results";
        const options: APIRequestOptions = { params: { id: simSetId } };
        return this.apiService.request$<Paginated<ResultDTO>>(operation, options);
    }

    getSimConfig$(id: number): Observable<SimConfigDTO> {
        const operation: string = "SimConfigController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<SimConfigDTO>(operation, options);
    }

    createSimConfig$(simSetId: number, orgConfigId: number, disableUI: boolean = true): Observable<SimConfigDTO> {
        const endpoint: APIEndpoint = {
            path: `sim-config`,
            method: HttpMethod.POST
        };
        return this.httpService.request$(endpoint, disableUI);
    }

    getSimConfigResultSet$(simConfigId: number): Observable<ResultDTO[]> {
        const operation: string = "SimConfigController_results";
        const options: APIRequestOptions = { params: { id: simConfigId } };
        return this.apiService.request$<ResultDTO[]>(operation, options);
    }

    getResult$(id: number): Observable<ResultDTO> {
        const operation: string = "ResultController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<ResultDTO>(operation, options);
    }

    getOrgConfigs$(query?: PaginateQuery): Observable<OrgConfigDTO[]> {
        const operation: string = "OrgConfigController_index";
        const options: APIRequestOptions = { query: query };
        return this.apiService.request$<OrgConfigDTO[]>(operation, options);
    }

    getOrgConfig$(id: number): Observable<OrgConfigDTO> {
        const operation: string = "OrgConfigController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<OrgConfigDTO>(operation, options);
    }

    createOrgConfig$(
        configuratorParamsDTO: ConfiguratorParamsDTO,
        disableUI: boolean = true
    ): Observable<OrgConfigDTO> {
        const endpoint: APIEndpoint = {
            path: `org-config`,
            method: HttpMethod.POST
        };
        return this.httpService.request$(endpoint, disableUI);
    }

    deleteOrgConfig$(id: number): Observable<void> {
        const endpoint: APIEndpoint = {
            path: `org-config/${id}`,
            method: HttpMethod.DELETE
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getStateSpace$(resultId: number): Observable<StateSpace> {
        const operation = "StateSpaceController_index";
        const options: APIRequestOptions = { params: { id: resultId } };
        return this.apiService.request$<StateSpacePointDTO[]>(operation, options).pipe(
            map((stateSpaceDTO: StateSpacePointDTO[]) => {
                return new StateSpace(stateSpaceDTO);
            })
        );
    }

    generateConfigurationBatch$(
        simSetId: number,
        configuratorParamsDTOs: ConfiguratorParamsDTO[]
    ): Observable<SimConfigDTO> {
        let count = 0;
        const maxCount = configuratorParamsDTOs.length;
        return of(this.spinnerService.show()).pipe(
            switchMap(() => {
                return from(configuratorParamsDTOs);
            }),
            concatMap((configuratorParamsDTO) => {
                count++;
                this.spinnerService.update("Generating configuration " + count + " of " + maxCount);
                return this.createOrgConfig$(configuratorParamsDTO, false);
            }),
            concatMap((orgConfig) => {
                if (simSetId && orgConfig.id) {
                    return this.createSimConfig$(simSetId, orgConfig.id, false);
                } else {
                    throw new Error("SimSetId or OrgConfigId is missing");
                }
            }),
            finalize(() => {
                this.spinnerService.hide();
            }),
            catchError((error) => {
                console.error(error);
                this.spinnerService.hide();
                throw error;
            })
        );
    }
}
