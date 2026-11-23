export default defineAppConfig({
    portalUrl: "https://xfontr-monorepo.pages.dev",

    ui: {
        container: {
            // The stock `sm:px-6 lg:px-8` outlive a `md:`-only override, so both steps are restated
            base: "sm:px-4 md:px-10 lg:px-10",
        },
    },
});
