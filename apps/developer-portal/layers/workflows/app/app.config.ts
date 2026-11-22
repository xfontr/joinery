export default defineAppConfig({
    nav: {
        workflows: {
            icon: "i-lucide-route",
            to: "/workflows",
            menu: "/api/workflows/menu",
        },
    },
    projectTabs: {
        workflows: { rows: "/api/workflows/areas", to: "/workflows" },
    },
});
