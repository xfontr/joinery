import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IssuesRead } from "#layers/github/shared/issues.ts";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { MenuRow } from "~/types/MenuRow";
import type { RailFigure } from "~/types/RailFigure";
import type { SearchSection } from "~/utils/search";
import Layout from "./default.vue";

// GitHub is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({ read: null as unknown }));
mockNuxtImport("useIssues", () => () => ({ data: github.read, shown: github.read }));

// Search reads the docs collection, so a call here means the search data was built
const search = vi.hoisted(() => vi.fn((): Promise<SearchSection[]> => Promise.resolve([])));
mockNuxtImport("queryCollectionSearchSections", () => search);

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
} = {}) => {
    serveEndpoint("/api/badges", () => ({ ...NEVER_COLLECTED, ...badges }));
    serveEndpoint("/api/telemetry/figure", () => tooling);
    const answers: Record<string, MenuRow[]> = {
        "/api/decisions/menu": decisions,
        "/api/projects/menu": projects,
    };
    for (const menu of MENUS) serveEndpoint(menu, () => answers[menu] ?? []);
};

const open = async (route = "/overview") => {
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
    { label: "All projects", to: "/projects", badge: "2" },
    {
        label: "Apps",
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
    github.read = ref<IssuesRead>({ fetchedAt: "", error: null, issues: [] });
    search.mockClear();
});

describe("default layout", () => {
    it("groups every page under its app, each pointing at its route", async () => {
        serve();
        const wrapper = await open();

        expect(tree(wrapper)).toEqual([
            ["Home", "/overview", []],
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

    // The menu hands a nested list's open state to the top level's v-model, which folded the app
    it("keeps an app unfolded when a page inside it folds its own rows", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open(DECISION.to);

        await wrapper.find("nav a[href='/decisions'] [data-slot='linkTrailing']").trigger("click");
        await flushPromises();

        expect(wrapper.find(`nav a[href='${DECISION.to}']`).exists()).toBe(false);
        expect(wrapper.find("nav a[href='/audits']").exists()).toBe(true);
    });

    it("prints each Health page's figure in its tone, and nothing for a figure never collected", async () => {
        github.read = ref<IssuesRead>({
            fetchedAt: "2026-11-18T10:00:00Z",
            error: null,
            issues: [
                {
                    number: 1,
                    title: "One",
                    body: "",
                    url: "",
                    labels: [],
                    assignees: [],
                    createdAt: "",
                    updatedAt: "",
                },
            ],
        });
        serve({
            badges: {
                advisories: 3,
                worstSeverity: "high",
                collected: { branch: "master", commit: "abc1234", at: "2026-11-18T10:00:00Z" },
            },
            tooling: { value: "40%", alert: true },
        });
        const wrapper = await open();

        expect(page(wrapper, "Work in progress").badge).toEqual({ label: "1", class: "" });
        expect(page(wrapper, "Dependencies").badge).toEqual({ label: "3 adv.", class: "tone-bad" });
        expect(page(wrapper, "Tooling usage").badge).toEqual({
            label: "40% fail",
            class: "tone-bad",
        });
        expect(page(wrapper, "Coverage").badge).toBeUndefined();
    });

    // The lab's rail lists the kinds on the catalog, and a project's siblings on its page
    it("lists a menu's groups on the page that holds them", async () => {
        serve({ projects: KINDS });
        const wrapper = await open("/projects");

        expect(page(wrapper, "Projects").children?.map((row) => row.label)).toEqual([
            "All projects",
            "Apps",
        ]);
    });

    it("leaves a page folded on its own landing, and unfolds it on a page below", async () => {
        serve({ projects: KINDS });
        const landing = await open("/projects");
        const below = await open("/projects/blog");

        expect(landing.find("nav a[href='/projects?kind=apps']").exists()).toBe(false);
        expect(below.find("nav a[href='/projects/site']").exists()).toBe(true);
    });

    it("lists a group's members, each in its coverage tone, on a member's own page", async () => {
        serve({ projects: KINDS });
        const wrapper = await open("/projects/blog");

        expect(page(wrapper, "Projects").children).toEqual([
            expect.objectContaining({
                to: "/projects/blog",
                badge: { label: "40%", class: "tone-bad" },
            }),
            expect.objectContaining({ to: "/projects/site", badge: { label: "—", class: "" } }),
        ]);
    });

    it("prints the snapshot's branch, commit and figures in the status bar", async () => {
        serve({
            badges: {
                advisories: 2,
                worstSeverity: "high",
                lineCoverage: 81,
                docPages: 12,
                brokenLinks: 1,
                collected: { branch: "master", commit: "abc1234def", at: "2026-11-18T10:00:00Z" },
            },
        });
        const wrapper = await open();

        expect(status(wrapper)).toContain("master");
        expect(status(wrapper)).toContain("@abc1234");
        expect(figures(wrapper)).toEqual([
            "coverage: 81% lines",
            "advisories: 2 worst high",
            "tooling: — failed",
            "issues: — open",
            "docs: 12 1 broken link",
        ]);
    });

    it("says the snapshot was never collected instead of printing zeros", async () => {
        serve();
        const wrapper = await open();

        expect(status(wrapper)).toContain("never collected");
        expect(figures(wrapper)).toContain("coverage: — lines");
        expect(figures(wrapper)).toContain("advisories: — none");
    });

    it("links the repository's source, in a new tab", async () => {
        serve();
        useRuntimeConfig().public.repoUrl = "https://github.com/acme/repo";
        const wrapper = await open();
        useRuntimeConfig().public.repoUrl = "";
        const source = wrapper.find("a[aria-label='View source on GitHub']");

        expect(source.attributes("href")).toBe("https://github.com/acme/repo");
        expect(source.attributes("target")).toBe("_blank");
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
