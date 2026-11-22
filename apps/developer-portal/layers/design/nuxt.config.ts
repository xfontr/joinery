import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    css: [fileURLToPath(new URL("./app/assets/main.css", import.meta.url))],

    ui: {
        experimental: { componentDetection: true },
        theme: {
            colors: ["primary", "secondary", "success", "info", "warning", "error", "neutral"],
        },
    },

    fonts: {
        defaults: { subsets: ["latin", "latin-ext"] },
        families: [
            { name: "Fraunces", weights: [300, 600], styles: ["normal", "italic"] },
            { name: "IBM Plex Sans", weights: [400, 500, 600] },
            { name: "IBM Plex Mono", weights: [400, 500] },
        ],
    },

    colorMode: {
        preference: "system",
        fallback: "dark",
    },
});
