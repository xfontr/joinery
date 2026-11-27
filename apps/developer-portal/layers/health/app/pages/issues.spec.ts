import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GithubIssue } from "#layers/github/app/utils/issues.ts";
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

const ISSUES_API = "https://api.github.com/repos/acme/repo/issues";

const global = {
    stubs: {
        HealthIssueRow: {
            props: { issue: Object },
            template: "<div data-row>{{ issue.title }}</div>",
        },
    },
};

const issue = (
    number: number,
    title: string,
    labels: string[],
    updatedAt: string,
): GithubIssue => ({
    number,
    title,
    body: "",
    html_url: `https://github.com/acme/repo/issues/${number}`,
    labels: labels.map((name) => ({ name })),
    assignees: [],
    created_at: updatedAt,
    updated_at: updatedAt,
});

let requests = 0;

const serve = (reply: () => unknown) => {
    serveEndpoint(ISSUES_API, () => {
        requests += 1;
        return reply();
    });
};

const open = async () => {
    clearNuxtData("issues");
    const wrapper = await mountSuspended(Page, { global });
    await vi.waitFor(() => expect(requests).toBeGreaterThan(0));
    await flushPromises();
    return wrapper;
};

const rows = (wrapper: VueWrapper) => wrapper.findAll("[data-row]").map((row) => row.text());

beforeEach(() => {
    requests = 0;
    useRuntimeConfig().public.repoUrl = "https://github.com/acme/repo";
    serve(() => [
        issue(2, "Add docs", ["docs"], "2026-09-19T00:00:00Z"),
        issue(1, "Fix portal", ["bug"], "2026-09-20T00:00:00Z"),
    ]);
});

afterEach(() => {
    useRuntimeConfig().public.repoUrl = "";
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("issues page", () => {
    it("lists the most recently updated issue first", async () => {
        const wrapper = await open();

        expect(rows(wrapper)).toEqual(["Fix portal", "Add docs"]);
    });

    it("narrows the list to issues matching the search", async () => {
        const wrapper = await open();

        await wrapper.find("input").setValue("docs");

        expect(rows(wrapper)).toEqual(["Add docs"]);
    });

    it("offers every label found in the live issues, and narrows to the one picked", async () => {
        const wrapper = await open();
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
        serve(
            () =>
                new Response(JSON.stringify({ message: "rate limited" }), {
                    status: 403,
                    headers: { "content-type": "application/json" },
                }),
        );
        const wrapper = await open();

        expect(wrapper.text()).toContain("GitHub could not be reached");
    });

    it("re-reads GitHub when asked to", async () => {
        const wrapper = await open();

        await wrapper.find("[aria-label='Re-read the issues from GitHub']").trigger("click");

        await vi.waitFor(() => expect(requests).toBe(2));
    });
});
