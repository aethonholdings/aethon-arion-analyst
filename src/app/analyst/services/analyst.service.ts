import { Injectable } from "@angular/core";
import {
    ConfiguratorParamData,
    ConfiguratorParamsDTO,
    OptimiserStateDTO,
    OrgConfigDTO,
    ResultDTO,
    SimConfigDTO,
    SimSetDTO,
    StateSpace,
    StateSpacePointDTO
} from "aethon-arion-pipeline";
import { Observable, catchError, concatMap, finalize, from, map, of, shareReplay, switchMap, timer } from "rxjs";

/** GET /arion/progress: a snapshot of the work in progress. */
export interface ProgressDTO {
    generatedAt: string;
    activity: {
        windowMinutes: number;
        dispatchedRuns: number;
        results: number;
        failedRuns: number;
        resultsPerMinute: number;
        resultsLastHour: number;
        inFlightRuns: number;
        activeInstances: number;
    };
    nodes: {
        id: string;
        hostname: string | null;
        lastSeenAt: string | null;
        active: boolean;
        instances: number;
        results: number;
        revoked: boolean;
    }[];
    simSets: ProgressSimSetDTO[];
}

export interface ProgressSimSetDTO {
    id: number;
    description: string;
    state: string;
    steps: number;
    currentStepId: number | null;
    currentStepStatus: string | null;
    currentStepPercentComplete: number | null;
    simConfigs: number;
    convergedSimConfigs: number;
    runningSimConfigs: number;
    failedSimConfigs: number;
    results: number;
    lastResultAt: string | null;
}

/** GET/PUT /arion/fleet: the node fleet (an AWS Auto Scaling group), when the server manages one. */
export interface FleetDTO {
    enabled: boolean;
    group?: string;
    desired?: number;
    min?: number;
    max?: number;
    counts?: { launching: number; building: number; running: number; stopping: number; pending: number };
    instances?: { id: string; type: string; state: string; phase: "launching" | "building" | "running" | "stopping"; availabilityZone?: string; launchTime?: string }[];
    lastError?: string | null;
}

export interface OrgConfigSummaryDTO {
    agentCount: number;
    orgConfigCount: number;
    avgPerformance: number | null;
    bestPerformance: number | null;
    stdDevPerformance: number | null;
}
import { Paginated, PaginateQuery } from "aethon-paginate-types";
import { API, APIHost, APIRequestOptions } from "aethon-api-types";
import { environment } from "src/env/environment";
import * as openApi from "../swagger/swagger.json";
import { ApiService } from "src/app/root/services/api.service";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";
import { ProgressState } from "src/app/root/types/root.types";

@Injectable({
    providedIn: "root"
})
export class AnalystService {
    private _refreshTimer: Observable<number> = timer(0, 60000).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    constructor(
        private apiService: ApiService,
        private spinnerService: SpinnerService
    ) {
        const host = AnalystService.apiHost(environment.host, window.location);
        const api = new API(host.protocol, host.name, openApi, host?.port, host?.basePath);
        this.apiService.setAPI(api);
    }

    /**
     * The API host: as configured, or, when the configured host name is empty, the address the analyst itself was
     * loaded from (the API served behind the same nginx, reachable however the browser reached the analyst, e.g. a
     * port forward).
     */
    static apiHost(configured: APIHost, location: Pick<Location, "protocol" | "hostname" | "port">): APIHost {
        if (configured?.name) return configured;
        return {
            ...configured,
            protocol: location.protocol.replace(":", "") as APIHost["protocol"],
            name: location.hostname,
            port: location.port ? Number(location.port) : undefined
        } as APIHost;
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

    getOptimiserState$(id: number): Observable<OptimiserStateDTO<ConfiguratorParamData>> {
        const operation: string = "OptimiserStateController_view";
        const options: APIRequestOptions = { params: {id: id}};
        return this.apiService.request$<OptimiserStateDTO<ConfiguratorParamData>>(operation, options);
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

    getOrgConfigSummary$(): Observable<OrgConfigSummaryDTO[]> {
        const operation: string = "OrgConfigController_summary";
        return this.apiService.request$<OrgConfigSummaryDTO[]>(operation, {});
    }

    getFleet$(): Observable<FleetDTO> {
        return this.apiService.request$<FleetDTO>("FleetController_get", {});
    }

    scaleFleet$(desired: number): Observable<FleetDTO> {
        return this.apiService.request$<FleetDTO>("FleetController_scale", { body: { desired } });
    }

    getProgress$(): Observable<ProgressDTO> {
        return this.apiService.request$<ProgressDTO>("ProgressController_index", {});
    }

    getRunningOrgConfigs$(): Observable<OrgConfigDTO[]> {
        const operation: string = "OrgConfigController_running";
        return this.apiService.request$<OrgConfigDTO[]>(operation, {});
    }

    getOrgConfigsByAgentCount$(agentCount: number): Observable<OrgConfigDTO[]> {
        const operation: string = "OrgConfigController_byAgentCount";
        const options: APIRequestOptions = { params: { agentCount } };
        return this.apiService.request$<OrgConfigDTO[]>(operation, options);
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

    getStateSpace$(resultId: number): Observable<StateSpace> {
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
        return "n.a.";
    }
}
