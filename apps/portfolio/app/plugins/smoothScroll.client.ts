import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** How much of the remaining distance each frame covers: 0.1 is Lenis's default glide, 1 is none. */
const LERP = 0.2;

export default defineNuxtPlugin(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let lenis: Lenis | undefined;

    // GSAP's ticker is in seconds, Lenis wants milliseconds
    const tick = (time: number) => lenis?.raf(time * 1000);

    const sync = () => {
        if (motion.matches && !lenis) {
            lenis = new Lenis({ autoRaf: false, anchors: true, lerp: LERP });
            lenis.on("scroll", () => ScrollTrigger.update());
            gsap.ticker.add(tick);
            // Lag smoothing would make the ticker skip time Lenis needs to keep the easing continuous
            gsap.ticker.lagSmoothing(0);
        } else if (!motion.matches && lenis) {
            gsap.ticker.remove(tick);
            lenis.destroy();
            lenis = undefined;
            gsap.ticker.lagSmoothing(500, 33);
        }
    };

    sync();
    motion.addEventListener("change", sync);
});
