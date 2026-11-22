import { withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCachedFetch } from "./useCachedFetch";

const endpoint = vi.hoisted(() => ({ hits: 0 }));

registerEndpoint("/api/cached-fetch-spec", () => {
    endpoint.hits++;

    return { hits: endpoint.hits };
});

const mountReader = async (page?: number) => {
    const { value, wrapper } = await withSetup(async () => {
        const request = useCachedFetch("/api/cached-fetch-spec", { query: { page } });
        // Awaited for the read, and wrapped so the caller keeps the request rather than its result
        await request;

        return { request };
    });

    return { request: value.request, unmount: () => wrapper.unmount() };
};

beforeEach(() => {
    endpoint.hits = 0;
    clearNuxtData();
});

describe("useCachedFetch", () => {
    it("serves a page the visitor comes back to from memory instead of refetching it", async () => {
        const first = await mountReader();
        first.unmount();
        const second = await mountReader();

        expect(endpoint.hits).toBe(1);
        expect(second.request.data.value).toEqual({ hits: 1 });
    });

    it("still fetches a query it hasn't seen yet", async () => {
        (await mountReader()).unmount();
        await mountReader(2);

        expect(endpoint.hits).toBe(2);
    });

    it("refetches when asked to refresh, so the cache never pins stale data for good", async () => {
        const { request } = await mountReader();

        await request.refresh();

        expect(endpoint.hits).toBe(2);
    });
});
