import { Environment } from "src/app/root/types/root.types";

export const environment = {
    debug: true,
    host: {
        protocol: "http",
        name: "192.168.1.164",
        basePath: "arion"
    }
} as Environment;
