import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Issue, IssuesRead } from "#layers/github/shared/issues.ts";
import Page from "./issues.vue";

// GitHub is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({ read: null as unknown, reload: vi.fn() }));

mockNuxtImport("useIssues", () => () => ({ data: github.read, reload: github.reload }));

// Each row has its own spec; here only which issues the page shows, and in what order
const global = {
    stubs: {
        HealthIssueRow: {
            props: { issue: Object },
            template: "<div data-row>{{ issue.title }}</div>",
        },
    },
};

const issue = (number: number, title: string, labels: string[], updatedAt: string): Issue => ({
    number,
    title,
    body: "",
    url: "",
    labels,
    assignees: [],
    createdAt: updatedAt,
    updatedAt,
});

const serve = (read: Partial<IssuesRead>) => {
    github.read = ref<IssuesRead>({ fetchedAt: "2026-09-20", error: null, issues: [], ...read });
};

const rows = (wrapper: VueWrapper) => wrapper.findAll("[data-row]").map((row) => row.text());

beforeEach(() => {
    github.reload.mockReset().mockResolvedValue(undefined);
    serve({
        issues: [
            issue(2, "Add docs", ["docs"], "2026-09-19"),
            issue(1, "Fix portal", ["bug"], "2026-09-20"),
        ],
    });
});

describe("issues page", () => {
    it("lists the most recently updated issue first", async () => {
        const wrapper = await mountSuspended(Page, { global });

        expect(rows(wrapper)).toEqual(["Fix portal", "Add docs"]);
    });

    it("narrows the list to issues matching the search", async () => {
        const wrapper = await mountSuspended(Page, { global });

        await wrapper.find("input").setValue("docs");

        expect(rows(wrapper)).toEqual(["Add docs"]);
    });

    it("offers every label found in the live issues, and narrows to the one picked", async () => {
        const wrapper = await mountSuspended(Page, { global });
        const select = wrapper.findComponent({ name: "USelect" });

        expect((select.props("items") as { value: string }[]).map(({ value }) => value)).toEqual([
            "all",
            "bug",
            "docs",
        ]);

        await select.setValue("bug");

        expect(rows(wrapper)).toEqual(["Fix portal"]);
    });

    it("says GitHub could not be reached when the read failed", async () => {
        serve({ error: "rate limited" });
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("GitHub could not be reached");
    });

    it("says there are no open issues when GitHub answered with none", async () => {
        serve({ issues: [] });
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("No open issues.");
    });

    it("re-reads GitHub when asked to", async () => {
        const wrapper = await mountSuspended(Page, { global });

        await wrapper.find("[aria-label='Re-read the issues from GitHub']").trigger("click");

        expect(github.reload).toHaveBeenCalledOnce();
    });
});
