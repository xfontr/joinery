import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { fakeAuthor } from "@joinery/content/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { useRequiredFetch } from "./useRequiredFetch";

const AUTHORS: Facet<Author>[] = [{ value: fakeAuthor(), count: 2 }];

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

beforeEach(() => {
    clearNuxtData();
});

describe("useRequiredFetch", () => {
    it("reads the route it is given", async () => {
        serve(() => AUTHORS);
        const { data } = await setUp();

        expect(data?.value).toEqual(AUTHORS);
    });

    it("reads under the route's default key, so it never takes another read's payload", async () => {
        serve(() => AUTHORS);
        serveEndpoint("/api/tags", () => [{ value: "dolo", count: 1 }]);

        const { value } = await withSetup(async () => ({
            authors: await useRequiredFetch<Facet<Author>[]>("/api/authors", () => []),
            tags: await useRequiredFetch<unknown[]>("/api/tags", () => []),
        }));

        expect(value.authors.value).toEqual(AUTHORS);
        expect(value.tags.value).toEqual([{ value: "dolo", count: 1 }]);
    });

    it("throws a fatal page error with the route's status when the route can't be read", async () => {
        serve(() => new Response("Bad gateway", { status: 502 }));

        expect((await setUp()).failure).toMatchObject({ status: 502, fatal: true });
    });
});
