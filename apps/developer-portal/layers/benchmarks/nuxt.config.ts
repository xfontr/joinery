export default defineNuxtConfig({
    routeRules: {
        "/benchmarks/**": { robots: "noindex, follow" },
    },
});
