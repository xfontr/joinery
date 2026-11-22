import type { PageTransition } from "~/types/PageTransition";

/** A click older than this didn't start the navigation, so the reveal opens from the view switch. */
const CLICK_MS = 1000;

export default defineNuxtPlugin((nuxtApp) => {
    const root = document.documentElement;
    let kind: PageTransition = "dev";
    let click: { x: number; y: number; at: number } | null = null;

    window.addEventListener(
        "click",
        (event) => {
            // A keyboard-activated click reports `detail` 0 and sits at the viewport's corner.
            if (event.detail > 0) click = { x: event.clientX, y: event.clientY, at: Date.now() };
        },
        { capture: true },
    );

    useRouter().beforeEach((to, from) => {
        kind = pageTransitionOf(from.meta.layout, to.meta.layout);
    });

    const revealFrom = () => {
        if (click && Date.now() - click.at < CLICK_MS) return click;
        const rect = document.querySelector("[data-view-switch]")?.getBoundingClientRect();
        return rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: innerWidth, y: 0 };
    };

    nuxtApp.hook("page:view-transition:start", (transition) => {
        root.dataset.pageTransition = kind;

        if (kind === "mode") {
            const { x, y } = revealFrom();
            const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
            root.style.setProperty("--reveal-x", `${x}px`);
            root.style.setProperty("--reveal-y", `${y}px`);
            root.style.setProperty("--reveal-r", `${radius}px`);
        }

        void transition.finished.finally(() => {
            delete root.dataset.pageTransition;
            for (const name of ["--reveal-x", "--reveal-y", "--reveal-r"])
                root.style.removeProperty(name);
        });
    });
});
