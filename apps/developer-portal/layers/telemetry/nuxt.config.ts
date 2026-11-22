import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    routeRules: {
        "/telemetry/**": { robots: "noindex, follow" },
    },

    css: [fileURLToPath(new URL("./app/assets/telemetry.css", import.meta.url))],
});
