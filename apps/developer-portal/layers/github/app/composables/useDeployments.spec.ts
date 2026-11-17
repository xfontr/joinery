import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Deployment, DeploymentStatus } from "#layers/github/shared/deployments.ts";
import { useDeployments } from "./useDeployments.ts";

const nuxt = vi.hoisted(() => ({ options: new Map<string, unknown>() }));

// A spy over the real composable: every read still runs, and its rendering options can be read
mockNuxtImport("useAsyncData", (original) => (...args: Parameters<typeof original>) => {
    nuxt.options.set(args[0] as string, args[2]);
    return original(...args);
});

const API = "https://api.github.com/repos/acme/repo/deployments";

const requests: string[] = [];

/** Fakes GitHub's deployments endpoint and each deployment's statuses endpoint. */
const github = (deployments: Deployment[], statuses: Record<number, DeploymentStatus[]> = {}) => {
    serveEndpoint(API, () => {
        requests.push(API);
        return deployments;
    });
    for (const [id, list] of Object.entries(statuses))
        serveEndpoint(`${API}/${id}/statuses`, () => {
            requests.push(`${API}/${id}/statuses`);
            return list;
        });
};

const use = async (repoUrl = "https://github.com/acme/repo") => {
    useRuntimeConfig().public.repoUrl = repoUrl;
    const { value } = await withSetup(() => {
        clearNuxtData("deployments");
        return useDeployments();
    });
    return { data: value.data };
};

afterEach(() => {
    requests.length = 0;
    useRuntimeConfig().public.repoUrl = "";
});

describe("useDeployments", () => {
    it("says the repository URL is wrong before asking GitHub anything", async () => {
        github([]);
        const { data } = await use("");

        expect(data.value.error).toContain("does not name a repository");
        expect(requests).toEqual([]);
    });

    it("reads statuses only for the newest deployment in each environment", async () => {
        github(
            [
                { id: 3, environment: "production" },
                { id: 2, environment: "production" },
                { id: 4, environment: "preview" },
            ],
            {
                3: [
                    {
                        state: "success",
                        environment_url: "https://prod.example",
                        created_at: "2026-09-20",
                    },
                ],
                4: [{ state: "failure", environment_url: null, created_at: "2026-09-19" }],
            },
        );
        const { data } = await use();

        expect(requests).not.toContain(`${API}/2/statuses`);
        expect(data.value.deployments).toEqual([
            { environment: "preview", state: "failure", url: null, updatedAt: "2026-09-19" },
            {
                environment: "production",
                state: "success",
                url: "https://prod.example",
                updatedAt: "2026-09-20",
            },
        ]);
    });

    it("shows GitHub's rate-limit message rather than the fetch client's 403 status line", async () => {
        serveEndpoint(
            API,
            () =>
                new Response(
                    JSON.stringify({ message: "API rate limit exceeded for 203.0.113.7." }),
                    { status: 403, headers: { "content-type": "application/json" } },
                ),
        );
        const { data } = await use();

        expect(data.value.error).toBe("API rate limit exceeded for 203.0.113.7.");
        expect(data.value.deployments).toEqual([]);
    });

    it("reads GitHub from the browser, never into the prerendered page", async () => {
        github([]);
        await use();

        expect(nuxt.options.get("deployments")).toMatchObject({ server: false });
    });
});
