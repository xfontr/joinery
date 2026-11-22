export default defineNuxtConfig({
    routeRules: {
        "/coverage/**": { robots: "noindex, follow" },
        "/deps/**": { robots: "noindex, follow" },
        "/issues/**": { robots: "noindex, follow" },
    },
});
