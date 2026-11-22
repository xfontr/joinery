export default defineNuxtConfig({
    routeRules: {
        "/audits/**": { robots: "noindex, follow" },
    },
});
