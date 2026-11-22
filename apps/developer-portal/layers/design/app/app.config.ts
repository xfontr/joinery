export default defineAppConfig({
    ui: {
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
