export default defineAppConfig({
    ui: {
        container: {
            // The stock `sm:px-6 lg:px-8` outlive a `md:`-only override, so both steps are restated
            base: "sm:px-4 md:px-10 lg:px-10",
        },
        dashboardPanel: {
            slots: { root: "pb-7", body: "bg-muted *:shrink-0" },
        },
        card: {
            variants: {
                variant: {
                    flush: {
                        root: "bg-default ring ring-default divide-y divide-default",
                        body: "p-0 sm:p-0",
                    },
                },
            },
        },
    },
});
