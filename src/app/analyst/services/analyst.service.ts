import { Injectable } from "@angular/core";
import {
    ConfiguratorParamData,
    ConfiguratorParamsDTO,
    OrgConfigDTO,
    ResultDTO,
    SimConfigDTO,
    SimSetDTO,
    StateSpace,
    StateSpacePointDTO
} from "aethon-arion-pipeline";
import { Observable, catchError, concatMap, finalize, from, map, of, share, switchMap, timer } from "rxjs";
import { Paginated, PaginateQuery } from "aethon-paginate-types";
import { API, APIRequestOptions } from "aethon-api-types";
import { environment } from "src/env/environment";
import * as openApi from "../swagger/swagger.json";
import { ApiService } from "src/app/root/services/api.service";
import { SpinnerService } from "src/app/root/services/spinner.service";
import { ProgressState } from "src/app/root/types/root.types";

@Injectable({
    providedIn: "root"
})
export class AnalystService {
    private _refreshTimer: Observable<number> = timer(0, 10000).pipe(share());

    constructor(
        private apiService: ApiService,
        private spinnerService: SpinnerService
    ) {
        const host = environment.host;
        const api = new API(host.protocol, host.name, openApi, host?.port, host?.basePath);
        this.apiService.setAPI(api);
    }

    getRefeshTimer$(): Observable<number> {
        return this._refreshTimer;
    }

    getSimSets$(): Observable<SimSetDTO[]> {
        const operation: string = "SimSetController_index";
        return this.apiService.request$<SimSetDTO[]>(operation, {});
    }

    getSimSet$(id: number): Observable<SimSetDTO> {
        const operation: string = "SimSetController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<SimSetDTO>(operation, options);
    }

    createSimSet$(simSetDTO: SimSetDTO): Observable<SimSetDTO> {
        const operation: string = "SimSetController_create";
        const options: APIRequestOptions = { body: simSetDTO };
        return this.apiService.request$<SimSetDTO>(operation, options);
    }

    deleteSimSet$(id: number): Observable<void> {
        const operation: string = "SimSetController_delete";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<void>(operation, options);
    }

    getSimSetSimConfigs$(simSetId: number, pageNumber: number = 1): Observable<Paginated<SimConfigDTO>> {
        const operation: string = "SimSetController_simConfigs";
        const options: APIRequestOptions = {
            params: { id: simSetId },
            query: { page: pageNumber, orderBy: [["avgPerformance", "DESC"]] } as PaginateQuery
        };
        return this.apiService.request$<Paginated<SimConfigDTO>>(operation, options);
    }

    getSimSetResultSet$(simSetId: number): Observable<ProgressState<ResultDTO[]>> {
        const operation: string = "SimSetController_results";
        const options: APIRequestOptions = { params: { id: simSetId } };
        return this.apiService.fetchAllPaginated$<ResultDTO[]>(operation, options);
    }

    getSimConfig$(id: number): Observable<SimConfigDTO> {
        const operation: string = "SimConfigController_view";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<SimConfigDTO>(operation, options);
    }

    createSimConfig$(
        simSetId: number,
        orgConfigId: number,
        days: number = 100,
        randomStreamType: string = "random"
    ): Observable<SimConfigDTO> {
        const operation: string = "SimConfigController_create";
        const options: APIRequestOptions = { body: { simSetId: simSetId, orgConfigId, days, randomStreamType } };
        return this.apiService.request$<SimConfigDTO>(operation, options).pipe(
            map((response) => {
                return response;
            })
        );
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

    createOrgConfig$<T extends ConfiguratorParamData>(
        configuratorParamsDTO: ConfiguratorParamsDTO<T>
    ): Observable<OrgConfigDTO> {
        const operation: string = "OrgConfigController_create";
        const options: APIRequestOptions = { body: configuratorParamsDTO };
        return this.apiService.request$<OrgConfigDTO>(operation, options);
    }

    deleteOrgConfig$(id: number): Observable<void> {
        const operation: string = "OrgConfigController_delete";
        const options: APIRequestOptions = { params: { id: id } };
        return this.apiService.request$<void>(operation, options);
    }

    getStateSpace$<T>(resultId: number): Observable<StateSpace<T>> {
        const operation = "StateSpaceController_index";
        const options: APIRequestOptions = { params: { id: resultId } };
        return this.apiService.request$<StateSpacePointDTO[]>(operation, options).pipe(
            map((stateSpaceDTO: StateSpacePointDTO[]) => {
                return new StateSpace(stateSpaceDTO);
            })
        );
    }

    generateConfigurationBatch$<T extends ConfiguratorParamData>(
        simSetId: number,
        configuratorParamsDTOs: ConfiguratorParamsDTO<T>[]
    ): Observable<SimConfigDTO> {
        let count = 0;
        const maxCount = configuratorParamsDTOs.length;
        return of(this.spinnerService.show()).pipe(
            switchMap(() => {
                return from(configuratorParamsDTOs);
            }),
            concatMap((configuratorParamsDTO) => {
                count++;
                this.spinnerService.updateProgress("Generating configuration " + count + " of " + maxCount);
                return this.createOrgConfig$(configuratorParamsDTO);
            }),
            concatMap((orgConfig) => {
                if (simSetId && orgConfig.id) {
                    return this.createSimConfig$(simSetId, orgConfig.id, 100, "random");
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

    getPercentComplete(simSet: SimSetDTO): string {
        if (simSet) {
            if (simSet.simConfigCount && simSet.completedSimConfigCount !== undefined) {
                if (simSet.simConfigCount > 0) {
                    return ((simSet.completedSimConfigCount / simSet.simConfigCount) * 100).toFixed(0);
                }
            }
        }
        return "n.a.";
    }
}
