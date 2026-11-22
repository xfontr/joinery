import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIssues } from "./useIssues.ts";

const nuxt = vi.hoisted(() => ({ options: new Map<string, unknown>() }));

// A spy over the real composable: every read still runs, and its rendering options can be read
mockNuxtImport("useAsyncData", (original) => (...args: Parameters<typeof original>) => {
    nuxt.options.set(args[0] as string, args[2]);
    return original(...args);
});

const ISSUES_API = "https://api.github.com/repos/acme/repo/issues";

const githubIssue = (number: number, pullRequest = false) => ({
    number,
    title: `Issue ${number}`,
    body: "A body",
    html_url: `https://github.com/acme/repo/issues/${number}`,
    labels: [{ name: "bug" }],
    assignees: [{ login: "ada" }],
    created_at: "2026-09-19T12:00:00.000Z",
    updated_at: "2026-09-20T11:00:00.000Z",
    ...(pullRequest ? { pull_request: {} } : {}),
});

const requests: string[] = [];

/** Fakes GitHub's issues endpoint, answering each request with the next reply in turn. */
const github = (...replies: (() => unknown)[]) => {
    serveEndpoint(ISSUES_API, (event) => {
        requests.push(String(event.path));
        return replies[Math.min(requests.length, replies.length) - 1]!();
    });
};

const use = async (repoUrl = "https://github.com/acme/repo") => {
    useRuntimeConfig().public.repoUrl = repoUrl;
    const { value } = await withSetup(async () => {
        clearNuxtData("issues");
        const issues = useIssues();
        // Awaited for the read, and wrapped so the caller keeps the state rather than its result
        await issues;
        return { issues };
    });
    return value;
};

afterEach(() => {
    requests.length = 0;
    useRuntimeConfig().public.repoUrl = "";
});

describe("useIssues", () => {
    it("says why without making a request when no repo is configured", async () => {
        github(() => []);
        const { data } = (await use("")).issues;

        expect(data.value.error).toContain("no repo to read");
        expect(requests).toEqual([]);
    });

    it("reads the repo's open issues, a hundred to a page, leaving pull requests out", async () => {
        github(() => [githubIssue(1), githubIssue(2, true)]);
        const { data } = (await use()).issues;

        expect(requests[0]).toMatch(/\?state=open&per_page=100$/);
        expect(data.value.issues.map((issue) => issue.number)).toEqual([1]);
        expect(data.value.fetchedAt).not.toBe("");
    });

    it("reports GitHub's own message when it refuses the read", async () => {
        github(
            () =>
                new Response(JSON.stringify({ message: "API rate limit exceeded" }), {
                    status: 403,
                    headers: { "content-type": "application/json" },
                }),
        );
        const { data } = (await use()).issues;

        expect(data.value.error).toBe("API rate limit exceeded");
        expect(data.value.issues).toEqual([]);
    });

    it("re-reads GitHub on reload, replacing what it had", async () => {
        github(
            () => [githubIssue(1)],
            () => [githubIssue(7)],
        );
        const { issues } = await use();

        await issues.reload();

        expect(issues.data.value.issues.map((issue) => issue.number)).toEqual([7]);
    });

    it("reads GitHub from the browser, never into the prerendered page", async () => {
        github(() => []);
        await use();

        expect(nuxt.options.get("issues")).toMatchObject({ server: false });
    });

    it("shows what was read once mounted, the same issues a render can rely on", async () => {
        github(() => [githubIssue(1)]);
        const { shown } = (await use()).issues;

        expect(shown.value.issues.map((issue) => issue.number)).toEqual([1]);
    });
});
