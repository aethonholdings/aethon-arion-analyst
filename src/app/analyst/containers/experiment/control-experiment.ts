/** Name of the C1 optimiser that runs a control experiment (see aethon-arion-c1 C1ControlExperimentOptimiser). */
export const CONTROL_EXPERIMENT_OPTIMISER = "C1ControlExperimentOptimiser";

/** Result of a control experiment, as stored in its optimiser state (optimiserData.result). */
export interface ControlExperimentResult {
    control: number;
    test: number;
    delta: number;
    standardError: number;
    ci95: [number, number];
    relativeDelta: number | null;
    pairs: number;
    testBetter: number;
    controlBetter: number;
    ties: number;
    significant: boolean;
}

export const isControlExperiment = (simSet: { optimiserName?: string } | null | undefined): boolean =>
    simSet?.optimiserName === CONTROL_EXPERIMENT_OPTIMISER;
