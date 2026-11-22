import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    finalize,
    map,
    mergeMap,
    Observable,
    of,
    switchMap,
    tap
} from "rxjs";
import { OrgConfigDTO, StateType } from "aethon-arion-pipeline";
import { AnalystService, OrgConfigSummaryDTO } from "src/app/analyst/services/analyst.service";
import {
    OrgConfigTableRow,
    SimConfigClickEvent,
    SortColumn,
    SortDirection
} from "src/app/analyst/components/core/org-config/views/table/org-config-table.component";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";

@Component({
    standalone: false,
    selector: "arion-org-config-index-container",
    templateUrl: "./org-config-index-container.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ["./org-config-index-container.component.scss"]
})
export class OrgConfigIndexContainerComponent implements OnInit {
    summary$!: Observable<OrgConfigSummaryDTO[]>;
    runningRows$!: Observable<OrgConfigTableRow[]>;
    tableRows$!: Observable<OrgConfigTableRow[]>;
    refreshing: boolean = false;
    selectedAgentCount: number | null = null;
    breadcrumbs: Breadcrumb[] = [{ label: "Org Configs" }];

    initialSortColumn: SortColumn = "avgPerformance";
    initialSortDirection: SortDirection = "desc";

    private agentCountSubject = new BehaviorSubject<number | null>(null);

    constructor(
        private analystService: AnalystService,
        private router: Router,
        private route: ActivatedRoute,
        private spinnerService: SpinnerService
    ) {}

    ngOnInit() {
        const qp = this.route.snapshot.queryParamMap;
        const col = qp.get("sortColumn") as SortColumn | null;
        const dir = qp.get("sortDirection") as SortDirection | null;
        if (col) this.initialSortColumn = col;
        if (dir) this.initialSortDirection = dir;

        this.runningRows$ = this.analystService.getRefeshTimer$().pipe(
            mergeMap(() => this.analystService.getRunningOrgConfigs$()),
            map((orgConfigs) => this.mapToTableRows(orgConfigs))
        );

        this.summary$ = this.analystService.getRefeshTimer$().pipe(
            map(() => (this.refreshing = true)),
            mergeMap(() => this.analystService.getOrgConfigSummary$()),
            tap(() => (this.refreshing = false))
        );

        // Re-fetch the table whenever the selection or the refresh timer fires
        this.tableRows$ = combineLatest([this.analystService.getRefeshTimer$(), this.agentCountSubject]).pipe(
            // switchMap: a newer selection cancels the request for an older one, so a slow response for a
            // previously clicked agent count can never overwrite the current table
            switchMap(([_, agentCount]) => {
                if (agentCount === null) return of([]);
                this.spinnerService.show("Loading org configs...");
                return this.analystService.getOrgConfigsByAgentCount$(agentCount).pipe(
                    map((orgConfigs) => this.mapToTableRows(orgConfigs)),
                    catchError((error) => {
                        console.error(error);
                        return of([]);
                    }),
                    finalize(() => this.spinnerService.hide())
                );
            })
        );
    }

    selectAgentCount(agentCount: number): void {
        this.selectedAgentCount = agentCount;
        this.agentCountSubject.next(agentCount);
    }

    onSortChange(event: { column: SortColumn; direction: SortDirection }): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { sortColumn: event.column, sortDirection: event.direction },
            queryParamsHandling: "merge",
            replaceUrl: true
        });
    }

    navigateToOrgConfig(orgConfigId: number): void {
        this.router.navigate(["/org-config", orgConfigId]);
    }

    navigateToSimConfig(event: SimConfigClickEvent): void {
        this.router.navigate(["/sim-config", event.simConfigId], {
            queryParams: { orgConfigId: event.orgConfigId }
        });
    }

    private mapToTableRows(orgConfigs: OrgConfigDTO[]): OrgConfigTableRow[] {
        const statePriority: StateType[] = ["failed", "running", "pending", "completed"];
        return orgConfigs.map((orgConfig) => {
            const simConfigs = (orgConfig.simConfigs ?? []).map((sc) => ({
                id: sc.id!,
                avgPerformance: sc.avgPerformance ?? null,
                state: (sc.state ?? "pending") as StateType
            }));
            const states = simConfigs.map((sc) => sc.state);
            const state: StateType = statePriority.find((s) => states.includes(s)) ?? "pending";
            return {
                orgConfigId: orgConfig.id!,
                configHash: (orgConfig.configuratorParams as any)?.hash ?? "",
                state,
                simConfigs
            };
        });
    }
}
