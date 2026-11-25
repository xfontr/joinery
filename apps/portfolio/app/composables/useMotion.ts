import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Every query a motion can run under; reduced motion matches none of them. */
const QUERIES = {
    /** Scroll-driven motion, on any device. */
    scroll: "(prefers-reduced-motion: no-preference)",
    /** Pointer-driven motion, only where a mouse hovers. */
    pointer: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
} as const;

type Setup = (context: { gsap: typeof gsap; scope: HTMLElement }) => void | (() => void);

/**
 * Runs `setup` once `scope` is mounted, while `query` matches, and reverts every tween, trigger
 * and split it made when the query stops matching or the component unmounts.
 */
export const useMotion = (
    scope: Readonly<Ref<HTMLElement | null>>,
    query: keyof typeof QUERIES,
    setup: Setup,
) => {
    let media: gsap.MatchMedia | undefined;

    onMounted(() => {
        if (!scope.value) return;
        gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, SplitText);

        const element = scope.value;
        media = gsap.matchMedia(element);
        media.add(QUERIES[query], () => setup({ gsap, scope: element }));

        // Trigger positions are measured before the web fonts swap in and move everything below
        void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    onBeforeUnmount(() => media?.revert());
};
