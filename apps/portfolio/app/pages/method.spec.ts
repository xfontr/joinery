import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { SiteData } from "~/types/SiteData";
import Page from "./method.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const EMPTY = {
    benchmarks: [],
    decisions: [],
    workflows: {
        projects: [],
        templates: [
            {
                id: "website-rebuild",
                title: "Website rebuild",
                summary: "An existing site rebuilt without losing an address.",
            },
        ],
        lessons: 3,
    },
    rules: null,
    specs: null,
} satisfies SiteData;

const open = async (data: Partial<SiteData> = {}) => {
    serveEndpoint(DATA_URL, () => ({ ...EMPTY, ...data }) satisfies SiteData);
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useRuntimeConfig().public.dataUrl = DATA_URL;
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        rules: { look: { count: "{count} studied" }, plan: { count: "{count} lessons" } },
        method: {
            prove: {
                checks: {
                    lint: { claimCount: "{count} rules" },
                    tests: { claimCount: "{count} specs" },
                },
            },
        },
    });
});

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("method page", () => {
    it("names every benchmarked site the portal lists", async () => {
        const wrapper = await open({
            benchmarks: [
                { id: "primer-style", title: "primer.style", screenshot: "/a.webp" },
                { id: "rauno-me", title: "rauno.me", screenshot: "/b.webp" },
            ],
        });

        expect(wrapper.get("#look").text()).toContain("primer.style · rauno.me");
    });

    it("lists the portal's workflow templates as the plan rule's terms", async () => {
        const wrapper = await open();

        expect(wrapper.get("#plan").text()).toContain("Website rebuild");
    });

    it("words the portal's spec count", async () => {
        const wrapper = await open({ specs: 42 });

        expect(wrapper.get("#prove").text()).toContain("42 specs");
    });

    it("states every rule without a number when nothing was ever collected", async () => {
        const wrapper = await open({ workflows: { projects: [], templates: [], lessons: 0 } });

        expect(wrapper.text()).not.toContain("studied");
        expect(wrapper.text()).not.toContain("specs");
        expect(wrapper.text()).toContain("method.prove.checks.lint.claim");
    });

    it("links each written-down decision to its page on the developer portal", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("#decide a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining(
                [
                    "/decisions/0009-comment-discipline",
                    "/decisions/0040-developer-portal-visitor-structure",
                ].map(portalUrl),
            ),
        );
    });
});
