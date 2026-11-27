import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { MenuRow } from "~/types/MenuRow";
import type { RailFigure } from "~/types/RailFigure";
import type { SearchSection } from "~/utils/search";
import Layout from "./default.vue";
import en from "../../i18n/locales/en.json";

const search = vi.hoisted(() => vi.fn((): Promise<SearchSection[]> => Promise.resolve([])));
mockNuxtImport("queryCollectionSearchSections", () => search);

const shell = vi.hoisted(() => ({ badges: null as Badges | null }));
mockNuxtImport("shellBadges", () => () => shell.badges);

const ISSUES_API = "https://api.github.com/repos/acme/repo/issues";

const MENUS = [
    "/api/decisions/menu",
    "/api/audits/menu",
    "/api/workflows/menu",
    "/api/projects/menu",
];

const NEVER_COLLECTED = {
    advisories: 0,
    worstSeverity: null,
    lineCoverage: null,
    docPages: null,
    brokenLinks: 0,
    collected: null,
} satisfies Badges;

const serve = ({
    badges = {} as Partial<Badges>,
    decisions = [] as MenuRow[],
    projects = [] as MenuRow[],
    tooling = { value: "—", alert: false } as RailFigure,
    issues = [] as unknown[],
} = {}) => {
    serveEndpoint(ISSUES_API, () => issues);
    shell.badges = { ...NEVER_COLLECTED, ...badges };
    serveEndpoint("/api/telemetry/figure", () => tooling);
    const answers: Record<string, MenuRow[]> = {
        "/api/decisions/menu": decisions,
        "/api/projects/menu": projects,
    };
    for (const menu of MENUS) serveEndpoint(menu, () => answers[menu] ?? []);
};

const open = async (route = "/") => {
    clearNuxtData("issues");
    const wrapper = await mountSuspended(Layout, { route });
    await flushPromises();
    return wrapper;
};

const rail = (wrapper: VueWrapper) => wrapper.findComponent({ name: "UNavigationMenu" });

interface Item {
    label: string;
    to: string;
    badge?: { label: string; class: string };
    children?: Item[];
}

const items = (wrapper: VueWrapper) => rail(wrapper).props("items") as Item[];

/** Every app with the pages under it, as label and destination, in order. */
const tree = (wrapper: VueWrapper) =>
    items(wrapper).map(({ label, to, children }) => [
        label,
        to,
        (children ?? []).map((child) => [child.label, child.to]),
    ]);

const page = (wrapper: VueWrapper, label: string) =>
    items(wrapper)
        .flatMap((app) => app.children ?? [])
        .find((found) => found.label === label)!;

const status = (wrapper: VueWrapper) => wrapper.find("footer[aria-label='Status']").text();

/** Each status figure as its link spells it out in full. */
const figures = (wrapper: VueWrapper) =>
    wrapper.findAll("footer[aria-label='Status'] a").map((link) => link.attributes("title"));

const KINDS: MenuRow[] = [
    { labelKey: "app.menu.allProjects", to: "/projects", badge: "2" },
    {
        labelKey: "app.menu.kinds.apps",
        to: "/projects?kind=apps",
        badge: "2",
        children: [
            { label: "blog", to: "/projects/blog", badge: "40%", coverage: 40 },
            { label: "site", to: "/projects/site", badge: "—", coverage: null },
        ],
    },
];

const DECISION = { label: "0036 Drop the UI kit", to: "/decisions/0036-ui" };

beforeEach(() => {
    search.mockClear();
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", en);
});

describe("default layout", () => {
    it("groups every page under its app, each pointing at its route", async () => {
        serve();
        const wrapper = await open();

        expect(tree(wrapper)).toEqual([
            ["Home", "/", []],
            [
                "Catalog",
                "/projects",
                [
                    ["Projects", "/projects"],
                    ["Architecture", "/graph"],
                    ["What's new", "/changelog"],
                ],
            ],
            [
                "Docs",
                "/wiki",
                [
                    ["Documentation", "/wiki"],
                    ["Decisions", "/decisions"],
                    ["Audits", "/audits"],
                    ["Benchmarks", "/benchmarks"],
                ],
            ],
            [
                "Work",
                "/workflows",
                [
                    ["Workflows", "/workflows"],
                    ["Work in progress", "/issues"],
                ],
            ],
            [
                "Health",
                "/coverage",
                [
                    ["Coverage", "/coverage"],
                    ["Dependencies", "/deps"],
                    ["Tooling usage", "/telemetry"],
                ],
            ],
        ]);
    });

    it("unfolds a page into the rows its menu route answers, and leaves an empty one a plain link", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open();

        expect(page(wrapper, "Decisions").children).toEqual([expect.objectContaining(DECISION)]);
        expect(page(wrapper, "Audits").children).toBeUndefined();
    });

    it("unfolds the app holding the current page, including a page under an entry's route", async () => {
        serve();
        const wrapper = await open("/projects/scripts");

        expect(wrapper.find("nav a[href='/graph']").exists()).toBe(true);
        expect(wrapper.find("nav a[href='/decisions']").exists()).toBe(false);
    });

    it("keeps an app unfolded when a page inside it folds its own rows", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open(DECISION.to);

        await wrapper.find("nav a[href='/decisions'] [data-slot='linkTrailing']").trigger("click");
        await flushPromises();

        expect(wrapper.find(`nav a[href='${DECISION.to}']`).exists()).toBe(false);
        expect(wrapper.find("nav a[href='/audits']").exists()).toBe(true);
    });

    it("leaves a page folded on its own landing, and unfolds it on a page below", async () => {
        serve({ projects: KINDS });
        const landing = await open("/projects");
        const below = await open("/projects/blog");

        expect(landing.find("nav a[href='/projects?kind=apps']").exists()).toBe(false);
        expect(below.find("nav a[href='/projects/site']").exists()).toBe(true);
    });

    it("says the snapshot was never collected instead of printing zeros", async () => {
        serve();
        const wrapper = await open();

        expect(status(wrapper)).toContain("never collected");
        expect(figures(wrapper)).toContain("coverage: — lines");
        expect(figures(wrapper)).toContain("advisories: — none");
    });

    it("builds the search data only once search is first opened", async () => {
        serve();
        const wrapper = await open();

        expect(search).not.toHaveBeenCalled();

        await wrapper.findComponent({ name: "UDashboardSearch" }).setValue(true, "open");
        await flushPromises();

        expect(search).toHaveBeenCalledOnce();
    });

    it("offers a page by its name in the search box, not only the docs that mention it", async () => {
        search.mockResolvedValueOnce([
            {
                id: "/docs/benchmarks/readme",
                title: "Benchmarks",
                titles: [],
                level: 1,
                content: "",
            },
        ]);
        serve();
        const wrapper = await open();
        const palette = wrapper.findComponent({ name: "UDashboardSearch" });

        await palette.setValue(true, "open");
        await flushPromises();
        await palette.setValue("benchmarks", "searchTerm");

        await vi.waitFor(() =>
            expect(document.body.querySelector("a[href='/benchmarks']")).not.toBeNull(),
        );
    });
});
