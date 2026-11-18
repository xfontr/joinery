import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    css: [fileURLToPath(new URL("./app/assets/main.css", import.meta.url))],

    ui: {
        theme: {
            colors: ["primary", "secondary", "success", "info", "warning", "error", "neutral"],
        },
    },

    fonts: {
        families: [{ name: "Fraunces", weights: [300, 600], styles: ["normal", "italic"] }],
    },

    colorMode: {
        preference: "system",
        fallback: "dark",
    },
});
