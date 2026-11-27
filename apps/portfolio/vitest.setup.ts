import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterAll, beforeAll, beforeEach } from "vitest";

// Every `t()` misses unless a spec merges its own messages in a later `beforeEach`, so specs assert
// on keys rather than on copy
beforeEach(() => {
    const { $i18n } = useNuxtApp();
    $i18n.setLocaleMessage($i18n.locale.value, {});
    $i18n.missingWarn = false;
});

// ScrollTrigger keeps a bare `requestAnimationFrame` loop alive while enabled, and a lap landing
// after the environment's teardown fails the run; a later file sharing the module enables it again.
beforeAll(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.enable();
});
afterAll(() => ScrollTrigger.disable(false, true));
