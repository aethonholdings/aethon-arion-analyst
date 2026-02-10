import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SimSetDTO } from "aethon-arion-pipeline";
import { Observable, Subject, interval, map, mergeMap, takeUntil, tap } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";

import { Views } from "src/app/analyst/constants/analyst.constants";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";

@Component({
    selector: "arion-sim-set-view-container",
    templateUrl: "./sim-set-view-container.component.html",
    styleUrls: ["./sim-set-view-container.component.scss"]
})
export class SimSetViewContainerComponent implements OnInit, OnDestroy {
    @Input() simSet$!: Observable<SimSetDTO>;
    @Output() selected: EventEmitter<number> = new EventEmitter<number>();
    simSetId: number;
    simSetRefresh$!: Observable<SimSetDTO>;
    refreshing: boolean = false;
    views = Views;
    activeTab: string = 'summary';
    secondsUntilRefresh: number = 60;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService,
        private spinnerService: SpinnerService
    ) {
        const tmp = this.activatedRoute.snapshot.paramMap.get("id");
        if (tmp) {
            this.simSetId = Number.parseInt(tmp);
        } else {
            throw new Error("No simSetId provided");
        }
    }

    ngOnInit() {
        // Countdown timer (updates every second)
        interval(1000).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.secondsUntilRefresh = this.secondsUntilRefresh > 0 ? this.secondsUntilRefresh - 1 : 60;
        });

        // Auto-refresh timer (every 60 seconds)
        this.simSetRefresh$ = this.analystService.getRefeshTimer$().pipe(
            map(() => {
                this.refreshing = true;
                this.secondsUntilRefresh = 60;
                this.spinnerService.show();
            }),
            mergeMap(() => {
                return this.analystService.getSimSet$(this.simSetId);
            }),
            tap(() => {
                this.refreshing = false;
                this.spinnerService.hide();
            })
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    manualRefresh() {
        this.secondsUntilRefresh = 60;
        // Just navigate to trigger a reload
        this.router.navigate(['/sim-set', this.simSetId], {
            queryParams: { refresh: Date.now() }
        });
    }

    deleteSimSet() {
        this.analystService.deleteSimSet$(this.simSetId).subscribe(() => {
            this.router.navigate(["/sim-set"]);
        });
    }

    onSelect(optimiserStateId: number) {
        this.router.navigate(["/optimiser-state", optimiserStateId])
    }
}
