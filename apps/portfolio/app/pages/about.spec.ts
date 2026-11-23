import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it } from "vitest";
import Page from "./about.vue";
import en from "../../i18n/locales/en.json";

const LINKEDIN = "https://www.linkedin.com/in/xifre/";
const GITHUB = "https://github.com/xfontr";
const REPO = "https://github.com/acme/repo";
const POST =
    "https://portal.spotify.com/blog/portal-by-spotify-cut-my-claude-code-token-usage-by-90";

const hrefs = async () => {
    const wrapper = await mountSuspended(Page, { route: "/about" });

    return wrapper.findAll("a").map((link) => link.attributes("href"));
};

afterEach(() => {
    useRuntimeConfig().public.repoUrl = "";
});

describe("about page", () => {
    it("links LinkedIn, GitHub and the repository when one is configured", async () => {
        useRuntimeConfig().public.repoUrl = REPO;

        expect(await hrefs()).toEqual([portalUrl("/"), POST, LINKEDIN, GITHUB, REPO]);
    });

    it("leaves the repository out rather than linking nowhere when none is configured", async () => {
        expect(await hrefs()).toEqual([portalUrl("/"), POST, LINKEDIN, GITHUB]);
    });

    it("keeps every linked phrase in the copy, so editing one can't drop its link unnoticed", async () => {
        useNuxtApp().$i18n.mergeLocaleMessage("en", { about: en.about });

        expect(await hrefs()).toEqual(
            expect.arrayContaining([
                ...["/graph", "/decisions", "/telemetry"].map(portalUrl),
                "/agentic-workflows",
                "/work/huella-legal",
            ]),
        );
    });
});
