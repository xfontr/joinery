// Inlined into <head> by nuxt.config.ts; a copy lives in apps/developer-portal, and the two must agree.
/* global window, document */
(() => {
    const KEY = "site-reveal";
    const CLICK_MS = 1000;
    const root = document.documentElement;
    let click = null;

    const revealFrom = () => {
        if (click && Date.now() - click.at < CLICK_MS) return click;
        const rect = document.querySelector("[data-view-switch]")?.getBoundingClientRect();
        return rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: window.innerWidth, y: 0 };
    };

    window.addEventListener(
        "click",
        (event) => {
            // A keyboard-activated click reports `detail` 0 and sits at the viewport's corner.
            if (event.detail > 0) click = { x: event.clientX, y: event.clientY, at: Date.now() };
        },
        { capture: true },
    );

    window.addEventListener("pageswap", (event) => {
        if (!event.viewTransition) return;
        const { x, y } = revealFrom();
        window.sessionStorage.setItem(KEY, JSON.stringify({ x, y }));
    });

    window.addEventListener("pagereveal", (event) => {
        const stored = window.sessionStorage.getItem(KEY);
        window.sessionStorage.removeItem(KEY);
        if (!event.viewTransition || !stored) return;

        const { x, y } = JSON.parse(stored);
        const { innerWidth: width, innerHeight: height } = window;
        const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
        root.dataset.pageTransition = "mode";
        root.style.setProperty("--reveal-x", `${x}px`);
        root.style.setProperty("--reveal-y", `${y}px`);
        root.style.setProperty("--reveal-r", `${radius}px`);

        void event.viewTransition.finished.finally(() => {
            delete root.dataset.pageTransition;
            for (const name of ["--reveal-x", "--reveal-y", "--reveal-r"])
                root.style.removeProperty(name);
        });
    });
})();
