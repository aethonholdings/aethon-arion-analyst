export interface BatchParams {
    loops: number;
    agentCount: {
        spans: {
            min: number;
            max: number;
        };
        layers: {
            min: number;
            max: number;
        };
    };
    graph: {
        teams: boolean;
        topDown: boolean;
    };
    controlStep: boolean;
    initialisers: {
        influence: {
            matrix: {
                null: boolean;
                random: boolean;
                hybrid: boolean;
                purposeful: boolean;
            };
            gains: number[];
        };
        judgment: {
            matrix: {
                null: boolean;
                random: boolean;
                hybrid: boolean;
                purposeful: boolean;
            };
            gains: number[];
        };
        incentive: {
            matrix: {
                null: boolean;
                random: boolean;
                hybrid: boolean;
                purposeful: boolean;
            };
            gains: number[];
        };
    };

}
