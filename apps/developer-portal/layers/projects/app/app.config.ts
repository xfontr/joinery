export default defineAppConfig({
    nav: {
        projects: { label: "Projects", icon: "i-lucide-folders", to: "/projects" },
        changelog: { label: "What's new", icon: "i-lucide-tag", to: "/changelog" },
        graph: { label: "Architecture", icon: "i-lucide-git-fork", to: "/graph" },
    },
});
