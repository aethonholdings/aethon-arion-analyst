import { APIHost } from "aethon-api-types";

export type Environment = {
    debug: boolean;
    host: APIHost;
};

export type ProgressState<T> = { progressPercent: number; data: T };
