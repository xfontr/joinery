import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { fakeAuthor } from "@monorepo/content/testing";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRequiredFetch } from "./useRequiredFetch";

const AUTHORS: Facet<Author>[] = [{ value: fakeAuthor(), count: 2 }];

// A spy over the real composable, so the request still runs and its options can be read
const reads = vi.hoisted(() => [] as unknown[][]);
mockNuxtImport("useCachedFetch", (original) => (...args: Parameters<typeof original>) => {
    reads.push(args);
    return original(...args);
});

const serve = (answer: () => unknown) => {
    serveEndpoint("/api/authors", answer);
};

const setUp = () =>
    withSetup(async () => ({
        data: await useRequiredFetch<Facet<Author>[]>("/api/authors", () => []),
    })).then(
        ({ value }) => ({ data: value.data, failure: undefined }),
        (failure: unknown) => ({ data: undefined, failure }),
    );

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    reads.length = 0;
    clearNuxtData();
});

describe("useRequiredFetch", () => {
    it("reads the route it is given", async () => {
        serve(() => AUTHORS);
        const { data } = await setUp();

        expect(data?.value).toEqual(AUTHORS);
    });

    // The article's author counts read the authors route under their own key
    it("reads under the route's default key, so it never takes another read's payload", async () => {
        serve(() => AUTHORS);
        await setUp();

        expect(reads.map(([url]) => url)).toEqual(["/api/authors"]);
        expect(reads[0]![1]).not.toHaveProperty("key");
    });

    // Thrown during setup, so server rendering answers with the route's own status
    it("throws a fatal page error with the route's status when the route can't be read", async () => {
        serve(() => new Response("Bad gateway", { status: 502 }));

        expect((await setUp()).failure).toMatchObject({ status: 502, fatal: true });
    });
});
