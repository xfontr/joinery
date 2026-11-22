export default defineNuxtConfig({
    routeRules: {
        "/wiki/**": { robots: "noindex, follow" },
    },
});
