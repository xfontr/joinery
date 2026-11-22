export default defineNuxtConfig({
    routeRules: {
        "/decisions/**": { robots: "noindex, follow" },
    },
});
