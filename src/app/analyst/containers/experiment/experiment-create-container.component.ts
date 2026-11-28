import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { AnalystService } from "src/app/analyst/services/analyst.service";
import { Breadcrumb } from "src/app/analyst/widgets/breadcrumbs/breadcrumbs.component";
import { SpinnerService } from "src/app/root/components/spinner/spinner.service";
import { CONTROL_EXPERIMENT_OPTIMISER } from "./control-experiment";

/** Settings shown on the form; every other configurator setting is kept as it was in the source configuration. */
export interface ExperimentForm {
    description: string;
    orgConfigs: number;
    days: number;
    spans: number;
    layers: number;
    graph: string;
    actionStateProbability: number;
    gains: { influence: number; judgment: number; incentive: number };
    matrixInit: { influence: string; judgment: string; incentive: string };
    reporting: { unitPrice: number; unitPayroll: number };
}

/**
 * Configures a control experiment: the configurator settings of an org config (or of an earlier experiment), edited,
 * run as a control group and a test group (with the board's control step) of the chosen number of org configs each.
 * Query parameters: orgConfig=<id> or simSet=<id of an earlier experiment>.
 */
@Component({
    standalone: false,
    selector: "arion-experiment-create-container",
    templateUrl: "./experiment-create-container.component.html",
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ExperimentCreateContainerComponent implements OnInit {
    form: ExperimentForm | null = null;
    source: string = "";
    error: string | null = null;
    submitting: boolean = false;
    breadcrumbs: Breadcrumb[] = [{ label: "SimSets", route: ["/sim-set"] }, { label: "New control experiment" }];
    matrixInitTypes = ["random", "hybrid", "purposeful", "null"];
    graphs = ["top-down", "teams"];
    private _base: any = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private analystService: AnalystService,
        private spinnerService: SpinnerService
    ) {}

    ngOnInit(): void {
        const query = this.route.snapshot.queryParamMap;
        const orgConfigId = query.get("orgConfig");
        const simSetId = query.get("simSet");
        if (orgConfigId) {
            this.analystService.getOrgConfig$(Number(orgConfigId)).subscribe({
                next: (orgConfig: any) => {
                    this.source = `OrgConfig ${orgConfig.id}`;
                    this._load(orgConfig.configuratorParams?.data, orgConfig.simConfigs?.[0]?.days, 100, `Control experiment from OrgConfig ${orgConfig.id}`);
                },
                error: (error) => (this.error = `OrgConfig ${orgConfigId} could not be loaded: ${error?.message ?? error}`)
            });
        } else if (simSetId) {
            this.analystService.getSimSet$(Number(simSetId)).subscribe({
                next: (simSet: any) => {
                    this.source = `SimSet ${simSet.id}`;
                    const params = simSet.optimiserParams ?? {};
                    this._load(params.config, simSet.simConfigParams?.days, Math.min(2000, (params.orgConfigs ?? 50) * 2), simSet.description);
                },
                error: (error) => (this.error = `SimSet ${simSetId} could not be loaded: ${error?.message ?? error}`)
            });
        } else {
            this.error = "Open this page from an org config (Control experiment) or from an earlier experiment.";
        }
    }

    /** The configurator settings the experiment will run (source settings with the form's edits applied). */
    config(): any {
        const f = this.form as ExperimentForm;
        return {
            ...this._base,
            spans: f.spans,
            layers: f.layers,
            graph: f.graph,
            actionStateProbability: f.actionStateProbability,
            gains: { ...(this._base.gains ?? {}), ...f.gains },
            matrixInit: { ...(this._base.matrixInit ?? {}), ...f.matrixInit },
            reporting: { ...(this._base.reporting ?? {}), ...f.reporting }
        };
    }

    /** Problems that prevent submission (empty when the form is valid). */
    problems(): string[] {
        const f = this.form;
        if (!f) return [];
        const problems: string[] = [];
        if (!Number.isInteger(f.orgConfigs) || f.orgConfigs < 2 || f.orgConfigs > 2000) problems.push("Org configs per group must be a whole number from 2 to 2,000");
        if (!Number.isInteger(f.days) || f.days < 1) problems.push("Days must be a whole number of at least 1");
        if (!Number.isInteger(f.spans) || f.spans < 1 || !Number.isInteger(f.layers) || f.layers < 1) problems.push("Spans and layers must be whole numbers of at least 1");
        for (const [name, value] of Object.entries(f.gains)) if (!(value >= 0)) problems.push(`The ${name} gain must be a number of at least 0`);
        if (!(f.actionStateProbability >= 0 && f.actionStateProbability <= 1)) problems.push("The action state probability must be between 0 and 1");
        return problems;
    }

    submit(): void {
        if (!this.form || this.problems().length > 0) return;
        this.submitting = true;
        this.spinnerService.show("Creating the experiment...");
        this.analystService
            .createSimSet$({
                modelName: "C1",
                description: this.form.description,
                optimiserName: CONTROL_EXPERIMENT_OPTIMISER,
                simConfigParams: { days: this.form.days, randomStreamType: "random" },
                optimiserParams: { config: this.config(), orgConfigs: this.form.orgConfigs }
            } as any)
            .pipe(
                finalize(() => {
                    this.submitting = false;
                    this.spinnerService.hide();
                })
            )
            .subscribe({
                next: (simSet: any) => this.router.navigate(["/sim-set", simSet.id]),
                error: (error) => (this.error = `The experiment could not be created: ${error?.message ?? error}`)
            });
    }

    private _load(data: any, days: number | undefined, orgConfigs: number, description: string): void {
        if (!data) {
            this.error = `${this.source} has no configurator settings`;
            return;
        }
        this._base = JSON.parse(JSON.stringify(data));
        delete this._base.board; // the experiment sets the control step for each group
        this.form = {
            description,
            orgConfigs,
            days: days ?? 100,
            spans: data.spans,
            layers: data.layers,
            graph: data.graph,
            actionStateProbability: data.actionStateProbability,
            gains: { ...data.gains },
            matrixInit: { ...data.matrixInit },
            reporting: { unitPrice: data.reporting?.unitPrice ?? 1, unitPayroll: data.reporting?.unitPayroll ?? 1 }
        };
    }
}
