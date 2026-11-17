import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { beforeEach, describe, expect, it } from "vitest";
import { useHome } from "./useHome";

const HOME: Home = {
    latest: [],
    recent: [],
    theses: [],
    subjects: [{ value: { id: "1", slug: "derecho-penal", name: "Derecho penal" }, count: 3 }],
    formats: [{ value: "articulo", count: 3 }],
};

const serve = (answer: () => unknown) => serveEndpoint("/api/home", answer);

const setUp = () =>
    withSetup(() => useHome()).then(
        ({ value }) => ({ controller: value, failure: undefined }),
        (failure: unknown) => ({ controller: undefined, failure }),
    );

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

describe("useHome", () => {
    it("reads the home route", async () => {
        serve(() => HOME);
        const { controller } = await setUp();

        expect(controller?.home.value).toEqual(HOME);
    });

    // Thrown during setup, so server rendering answers with the route's own status
    it("throws a fatal page error with the route's status when the home can't be read", async () => {
        serve(() => new Response("Bad gateway", { status: 502 }));

        expect((await setUp()).failure).toMatchObject({ status: 502, fatal: true });
    });
});
