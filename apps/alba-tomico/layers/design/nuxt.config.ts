import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    css: [fileURLToPath(new URL("./app/assets/main.css", import.meta.url))],

    ui: {
        colorMode: false,
        theme: {
            colors: ["primary", "neutral"],
        },
    },

    fonts: {
        defaults: {
            weights: [300, 600, 900],
            preload: true,
        },
    },
});
