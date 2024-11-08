import { Environment } from "src/app/root/types/root.types";

export const environment = {
    debug: true,
    host: {
        protocol: "http",
        name: "localhost",
        basePath: "arion",
        port: 3000
    }
} as Environment;
