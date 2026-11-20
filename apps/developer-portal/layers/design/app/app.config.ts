export default defineAppConfig({
    ui: {
        dashboardPanel: {
            slots: { root: "pb-7", body: "bg-muted *:shrink-0" },
        },
        card: {
            variants: {
                variant: {
                    // `outline` with no body padding, for a card that holds a table or a list of rows
                    flush: {
                        root: "bg-default ring ring-default divide-y divide-default",
                        body: "p-0 sm:p-0",
                    },
                },
            },
        },
    },
});
