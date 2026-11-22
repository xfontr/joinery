import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it } from "vitest";
import Page from "./about.vue";

const REPO = "https://github.com/acme/repo";

afterEach(() => {
    useRuntimeConfig().public.repoUrl = "";
});

describe("about page", () => {
    it("links the repository in a new tab when one is configured", async () => {
        useRuntimeConfig().public.repoUrl = REPO;
        const wrapper = await mountSuspended(Page, { route: "/about" });
        const repo = wrapper.find(`a[href='${REPO}']`);

        expect(repo.attributes("target")).toBe("_blank");
    });

    it("leaves the repository out rather than linking nowhere when none is configured", async () => {
        const wrapper = await mountSuspended(Page, { route: "/about" });
        const hrefs = wrapper.findAll("a").map((link) => link.attributes("href"));

        expect(hrefs).toEqual([
            "https://www.linkedin.com/in/xifre/",
            "/work",
            "/method",
            "/agentic-workflows",
            "/overview",
        ]);
    });
});
