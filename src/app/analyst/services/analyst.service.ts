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
import {
    Observable,
    catchError,
    concatMap,
    finalize,
    from,
    map,
    of,
    share,
    switchMap,
    timer
} from "rxjs";
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

    getSimSetSimConfigs$(simSetId: number, pageNumber: number = 1): Observable<Pagination<SimConfigDTO>> {
        const endpoint: Endpoint = {
            path: `/sim-set/${simSetId}/sim-config`,
            method: "GET",
            options: {
                params: {
                    page: pageNumber
                }
            }
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getSimSetResultSet$(simSetId: number): Observable<ResultDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-set/${simSetId}/result`,
            method: "GET",
            options: {}
        };
        return this.apiService.request$(endpoint).pipe(share());
    }

    getResultSet$(simConfigId: number): Observable<ResultDTO[]> {
        const endpoint: Endpoint = {
            path: `/sim-config/${simConfigId}/result`,
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
    ): Observable<SimConfigDTO> {
        let count = 0;
        let maxCount = configuratorParamsDTOs.length;
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

    createSimConfig$(simSetId: number, orgConfigId: number, disableUI: boolean = true): Observable<SimConfigDTO> {
        const endpoint: Endpoint = {
            path: `/sim-config/`,
            method: "POST",
            options: {
                body: {
                    simSetId: Number(simSetId),
                    orgConfigId: Number(orgConfigId)
                }
            }
        };
        return this.apiService.request$(endpoint, disableUI);
    }

    createOrgConfig$(
        configuratorParamsDTO: ConfiguratorParamsDTO,
        disableUI: boolean = true
    ): Observable<OrgConfigDTO> {
        const endpoint: Endpoint = {
            path: `/org-config/`,
            method: "POST",
            options: {
                body: configuratorParamsDTO
            }
        };
        return this.apiService.request$(endpoint, disableUI);
    }
}
