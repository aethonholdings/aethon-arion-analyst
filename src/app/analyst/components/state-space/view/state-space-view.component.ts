import { Component, Input } from "@angular/core";
import { C1AgentStatesArray, C1ReportingVariablesArray, C1PlantStateVariablesArray } from "aethon-arion-c1";
import { OrgConfigDTO, StateSpace, StateSpacePointDTO } from "aethon-arion-pipeline";
import { Observable, Subscription, delay, from, map } from "rxjs";

@Component({
    selector: "arion-state-space-view",
    templateUrl: "./state-space-view.component.html",
    styleUrls: ["./state-space-view.component.scss"]
})
export class StateSpaceViewComponent {
    @Input() stateSpace: StateSpace | null = null;
    @Input() orgConfig: OrgConfigDTO | null = null;
    stateSpacePoint: StateSpacePointDTO = {} as StateSpacePointDTO;
    type: string = "";
    clockTick: number = 0;
    clockTickMin: number = 0;
    clockTickMax: number = 0;
    agentCount: number = 0;
    agentStatesArray: string[] = [];
    plantVariablesArray: string[] = [];
    reportingVariablesArray: string[] = [];
    replay$: Observable<number> = new Observable<number>();
    subscription$: Subscription | null = null;
    running: boolean = false;
    buttonState: "Replay" | "Stop" = "Replay";
    agentStateProbabilities: number[][] = [];
    coordinationMatrix: number[][] = [];

    ngOnChanges(): void {
        if (this.stateSpace) {
            this.clockTick = 0;
            this.clockTickMin = 0;
            this.clockTickMax = this.stateSpace.length - 1;
            this.selectStateSpacePoint(this.clockTick);
            this.agentCount = this.stateSpacePoint.priorityTensor.length;
            this.agentStateProbabilities = this.stateSpace.agentStateProbabilities(this.agentStatesArray);
            this.coordinationMatrix = this.stateSpace.agentStateCoordinationMatrix();
        }
    }

    selectStateSpacePoint(clockTick: number) {
        if (this.stateSpace && this.orgConfig) {
            this.clockTick = clockTick;
            this.stateSpacePoint = this.stateSpace[clockTick];
            this.type = this.orgConfig.type;
            switch (this.type) {
                case "C1": {
                    this.agentStatesArray = C1AgentStatesArray;
                    this.plantVariablesArray = C1PlantStateVariablesArray;
                    this.reportingVariablesArray = C1ReportingVariablesArray;
                    break;
                }
            }
        }
    }

    replay() {
        if (!this.running) {
            this.running = true;
            this.buttonState = "Stop";
            const array = new Array<number>();
            for (let i = this.clockTick; i <= this.clockTickMax; i++) array.push(i);
            this.replay$ = from(array).pipe(
                delay(100),
                map((clockTick) => {
                    this.clockTick = clockTick;
                    this.selectStateSpacePoint(this.clockTick);
                    return clockTick;
                })
            );
            this.subscription$ = this.replay$.subscribe({
                complete: () => {
                    this.clockTick = 0;
                    this._resetButton();
                }
            });
        } else {
            this._resetButton();
        }
    }

    _resetButton() {
        this.running = false;
        this.buttonState = "Replay";
        this.subscription$?.unsubscribe();
        this.subscription$ = null;
        this.replay$ = new Observable<number>();
    }
}
