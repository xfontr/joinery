import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IssuesRead } from "#layers/github/shared/issues.ts";
import Layout from "./default.vue";

// GitHub is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({ read: null as unknown }));
mockNuxtImport("useIssues", () => () => ({ data: github.read }));

// Search reads the docs collection, so a call here means the search data was built
const search = vi.hoisted(() => vi.fn(() => Promise.resolve([])));
mockNuxtImport("queryCollectionSearchSections", () => search);

const MENUS = ["/api/decisions/menu", "/api/audits/menu", "/api/workflows/menu"];

const serve = ({ advisories = 0, decisions = [] as { label: string; to: string }[] } = {}) => {
    serveEndpoint("/api/badges", () => ({ advisories }));
    for (const menu of MENUS)
        serveEndpoint(menu, () => (menu === "/api/decisions/menu" ? decisions : []));
};

const open = async () => {
    const wrapper = await mountSuspended(Layout);
    await flushPromises();
    return wrapper;
};

const menus = (wrapper: VueWrapper) => wrapper.findAllComponents({ name: "UNavigationMenu" });

/** Every entry the sidebar offers, as label and destination, in order. */
const entries = (wrapper: VueWrapper) =>
    menus(wrapper).flatMap((menu) =>
        (menu.props("items") as { label: string; to: string }[]).map(({ label, to }) => [
            label,
            to,
        ]),
    );

const item = (wrapper: VueWrapper, label: string) =>
    menus(wrapper)
        .flatMap(
            (menu) =>
                menu.props("items") as { label: string; badge?: string; children?: unknown[] }[],
        )
        .find((found) => found.label === label)!;

const openSubmenus = (wrapper: VueWrapper) =>
    menus(wrapper).flatMap((menu) => menu.props("modelValue") as string[]);

const click = async (wrapper: VueWrapper, href: string) => {
    await wrapper.find(`nav a[href='${href}']`).trigger("click");
    await flushPromises();
};

const DECISION = { label: "0036 Drop the UI kit", to: "/decisions/0036-ui" };

beforeEach(() => {
    github.read = ref<IssuesRead>({ fetchedAt: "", error: null, issues: [] });
    search.mockClear();
});

describe("default layout", () => {
    it("lists every entry under its group, in order, pointing at its route", async () => {
        serve();
        const wrapper = await open();

        expect(entries(wrapper)).toEqual([
            ["Overview", "/"],
            ["Projects", "/projects"],
            ["What's new", "/changelog"],
            ["Documentation", "/wiki"],
            ["Architecture", "/graph"],
            ["Decisions", "/decisions"],
            ["Audits", "/audits"],
            ["Workflows", "/workflows"],
            ["Benchmarks", "/benchmarks"],
            ["Work in progress", "/issues"],
            ["Coverage", "/coverage"],
            ["Tooling usage", "/telemetry"],
            ["Dependencies", "/deps"],
        ]);
    });

    it("unfolds an entry into the rows its menu route answers, and leaves an empty one a plain link", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open();

        expect(item(wrapper, "Decisions").children).toEqual([DECISION]);
        expect(item(wrapper, "Audits").children).toBeUndefined();
    });

    it("opens a submenu when its entry is clicked, not only from the arrow beside it", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open();

        await click(wrapper, "/decisions");

        expect(openSubmenus(wrapper)).toEqual(["decisions"]);
    });

    it("folds the open submenu back when another entry is clicked, so only one stays open", async () => {
        serve({ decisions: [DECISION] });
        const wrapper = await open();

        await click(wrapper, "/decisions");
        await click(wrapper, "/coverage");

        expect(openSubmenus(wrapper)).toEqual([]);
    });

    it("badges the open issues and the advisories, and nothing at zero", async () => {
        github.read = ref<IssuesRead>({
            fetchedAt: "",
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
        serve({ advisories: 3 });
        const wrapper = await open();

        expect(item(wrapper, "Work in progress").badge).toBe("1");
        expect(item(wrapper, "Dependencies").badge).toBe("3");
        expect(item(wrapper, "Coverage").badge).toBeUndefined();
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
});
