import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    css: [fileURLToPath(new URL("./app/assets/main.css", import.meta.url))],

    ui: {
        colorMode: false,
        theme: {
            colors: ["primary", "secondary", "neutral", "error"],
        },
    },

    fonts: {
        defaults: {
            weights: [300, 500, 600, 700],
            subsets: ["latin", "latin-ext"],
            preload: true,
        },
    },
});
