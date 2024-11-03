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
import { API, APIEndpoint, HttpMethod } from "aethon-api-types";
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
        return this.apiService.request$<SimSetDTO>(operation, { params: { id: id } }, disableUI);
    }

    getSimSetSimConfigs$(simSetId: number, pageNumber: number = 1): Observable<Paginated<SimConfigDTO>> {
        const operation: string = "SimSetController_simConfigs";
        return this.apiService.request$<Paginated<SimConfigDTO>>(operation, {
            params: { id: simSetId },
            query: { page: pageNumber } as PaginateQuery
        });
    }

    getSimSetResultSet$(simSetId: number): Observable<ResultDTO[]> {
        const endpoint: APIEndpoint = {
            path: `sim-set/${simSetId}/result`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getResultSet$(simConfigId: number): Observable<ResultDTO[]> {
        const endpoint: APIEndpoint = {
            path: `sim-config/${simConfigId}/result`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint);
    }

    getResult$(resultId: number): Observable<ResultDTO> {
        const endpoint: APIEndpoint = {
            path: `result/${resultId}`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getOrgConfig$(orgConfigId: number): Observable<OrgConfigDTO> {
        const endpoint: APIEndpoint = {
            path: `org-config/${orgConfigId}`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getOrgConfigs$(query?: any): Observable<OrgConfigDTO[]> {
        const endpoint: APIEndpoint = {
            path: `org-config/`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    deleteOrgConfig$(id: number): Observable<void> {
        const endpoint: APIEndpoint = {
            path: `org-config/${id}`,
            method: HttpMethod.DELETE
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getSimConfig$(id: number): Observable<SimConfigDTO> {
        const endpoint: APIEndpoint = {
            path: `sim-config/${id}`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getSimConfigs$(query?: any): Observable<SimConfigDTO[]> {
        const endpoint: APIEndpoint = {
            path: `sim-config`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(share());
    }

    getStateSpace$(resultId: number): Observable<StateSpace> {
        const endpoint: APIEndpoint = {
            path: `state-space/${resultId}`,
            method: HttpMethod.GET
        };
        return this.httpService.request$(endpoint).pipe(
            map((stateSpaceDTO: StateSpacePointDTO[]) => {
                return new StateSpace(stateSpaceDTO);
            }),
            share()
        );
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

    createSimConfig$(simSetId: number, orgConfigId: number, disableUI: boolean = true): Observable<SimConfigDTO> {
        const endpoint: APIEndpoint = {
            path: `sim-config`,
            method: HttpMethod.POST
        };
        return this.httpService.request$(endpoint, disableUI);
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
