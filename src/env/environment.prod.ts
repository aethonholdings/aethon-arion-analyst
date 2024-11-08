import { Environment } from "src/app/root/types/root.types";

export const environment = {
    debug: true,
    host: {
        protocol: "http",
        name: "asterix.local",
        basePath: "arion"
    }
} as Environment;
