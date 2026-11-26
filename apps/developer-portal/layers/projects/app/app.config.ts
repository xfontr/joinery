export default defineAppConfig({
    nav: {
        projects: {
            icon: "i-lucide-folders",
            to: "/projects",
            menu: "/api/projects/menu",
        },
        changelog: { icon: "i-lucide-tag", to: "/changelog" },
        graph: { icon: "i-lucide-git-fork", to: "/graph" },
    },
});
