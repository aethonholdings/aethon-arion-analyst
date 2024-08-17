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
import { Observable, concatMap, finalize, from, map, of, share, switchMap, timer } from "rxjs";
import { Endpoint } from "aethon-arion-pipeline";
import { ApiService } from "src/app/root/modules/api/services/api.service";
import { Pagination } from "../interfaces/analyst.interfaces";
import { SpinnerService } from "src/app/root/modules/spinner/services/spinner.service";

@Injectable({
    providedIn: "root"
})
export class AnalystService {
    private _refreshTimer: Observable<number> = timer(0, 10000).pipe(share());

    constructor(private apiService: ApiService, private spinnerService: SpinnerService) {}

    getRefeshTimer$(): Observable<number> {
        return this._refreshTimer;
    }

    getSimSets$(disableUI: boolean = true): Observable<SimSetDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-set/`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint, disableUI);
    }

    getSimSet$(id: number, disableUI: boolean = true): Observable<any> {
        const endpoint: Endpoint = {
            path: `/sim-set/${id}`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint, disableUI);
    }

    getResultSet$(simConfigId: number): Observable<ResultDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-config/` + simConfigId + `/result`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint);
    }

    getResult$(resultId: number): Observable<ResultDTO> {
        const endpoint: Endpoint = {
            path: `/result/${resultId}`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getOrgConfig$(orgConfigId: number): Observable<OrgConfigDTO> {
        const endpoint: Endpoint = {
            path: `/org-config/${orgConfigId}`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getOrgConfigs$(query?: any): Observable<OrgConfigDTO[]> {
        const endpoint: Endpoint = {
            path: `/org-config/`,
            method: "GET",
            options: {
                params: query
            }
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    deleteOrgConfig$(id: number): Observable<void> {
        const endpoint: Endpoint = {
            path: `/org-config/${id}`,
            method: "DELETE",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getSimConfig$(id: number): Observable<SimConfigDTO> {
        const endpoint: Endpoint = {
            path: `/sim-config/${id}`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getSimSetSimConfigs$(simSetId: number): Observable<Pagination<SimConfigDTO>> {
        const endpoint: Endpoint = {
            path: `/sim-set/` + simSetId + `/sim-config`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getSimSetResultSet$(simSetId: number): Observable<ResultDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-set/` + simSetId + `/result`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getSimConfigs$(query?: any): Observable<SimConfigDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-config`,
            method: "GET",
            options: {
                params: query
            }
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getStateSpace$(resultId: number): Observable<StateSpace> {
        const endpoint: Endpoint = {
            path: `/state-space/${resultId}`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(
            map((stateSpaceDTO: StateSpacePointDTO[]) => {
                return new StateSpace(stateSpaceDTO);
            }),
            share()
        );
    }

    generateConfigurationBatch$(
        simSetId: number,
        configuratorParamsDTOs: ConfiguratorParamsDTO[]
    ): Observable<OrgConfigDTO> {
        let count = 0;
        let maxCount = configuratorParamsDTOs.length;
        return of(this.spinnerService.show()).pipe(
            switchMap(() => {
                return from(configuratorParamsDTOs);
            }),
            concatMap((configuratorParamsDTO) => {
                count++;
                this.spinnerService.update("Generating configuration " + count + " of " + maxCount);
                const endpoint: Endpoint = {
                    path: `/sim-set/` + simSetId + `/generate`,
                    method: "POST",
                    options: {
                        body: configuratorParamsDTO
                    }
                };
                return this.apiService.request$(endpoint, false);
            }),
            concatMap((response) => {
                return of(response);
            }),
            finalize(() => {
                this.spinnerService.hide();
            })
        );
    }

    createSimSet$(simSetDTO: SimSetDTO): Observable<SimSetDTO> {
        const endpoint: Endpoint = {
            path: `/sim-set/`,
            method: "POST",
            options: {
                body: simSetDTO
            }
        };
        return this.apiService.request$(endpoint);
    }

    deleteSimSet$(id: number): Observable<void> {
        const endpoint: Endpoint = {
            path: `/sim-set/${id}`,
            method: "DELETE",
            options: {}
        };
        return this.apiService.request$(endpoint);
    }
}
