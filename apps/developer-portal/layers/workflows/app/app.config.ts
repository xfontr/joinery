export default defineAppConfig({
    nav: {
        workflows: {
            label: "Workflows",
            icon: "i-lucide-route",
            to: "/workflows",
            menu: "/api/workflows/menu",
        },
    },
    projectTabs: {
        workflows: {
            label: "Workflows",
            rows: "/api/workflows/areas",
            to: "/workflows",
            empty: "No workflow runs in this project.",
        },
    },
});
