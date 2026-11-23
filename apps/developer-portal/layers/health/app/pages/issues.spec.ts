import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Issue, IssuesRead } from "#layers/github/app/utils/issues.ts";
import Page from "./issues.vue";

const MESSAGES = {
    app: {
        apps: {
            catalog: "Catalog",
            docs: "Docs",
            health: "Health",
            home: "Home",
            work: "Work",
        },
        nav: {
            audits: "Audits",
            benchmarks: "Benchmarks",
            changelog: "What's new",
            coverage: "Coverage",
            decisions: "Decisions",
            deps: "Dependencies",
            docs: "Documentation",
            graph: "Architecture",
            issues: "Work in progress",
            overview: "Overview",
            projects: "Projects",
            telemetry: "Tooling usage",
            workflows: "Workflows",
        },
    },
    healthIssuesRead: {
        read: "read {age}",
        refresh: "Re-read the issues from GitHub",
    },
    healthIssuesToolbar: {
        everyLabel: "Every label",
        search: "Search issues…",
    },
    issues: {
        empty: "No open issues.",
        error: {
            description:
                "{error} — this page reads GitHub from your browser, unauthenticated, which allows 60 requests an hour per address.",
            title: "GitHub could not be reached",
        },
        file: "File one with {command}.",
        intro: "Planned and active repository work appears here as issues from GitHub. The issue read is live in your browser; the rest of this portal remains a collected snapshot.",
        list: {
            note: "Read live from GitHub by your own browser. Nothing is stored here — the issue is the record, and this is a window onto it.",
            title: "Open issues",
        },
        title: "Work in progress",
    },
    listCard: {
        shown: "{shown} of {total}",
    },
    pageHeader: {
        wordmark: "joinery",
    },
};

const github = vi.hoisted(() => ({ read: null as unknown, reload: vi.fn() }));

mockNuxtImport("useIssues", () => () => ({ data: github.read, reload: github.reload }));

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

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
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
