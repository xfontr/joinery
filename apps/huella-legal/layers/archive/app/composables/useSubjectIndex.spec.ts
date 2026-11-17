import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { beforeEach, describe, expect, it } from "vitest";
import { useSubjectIndex } from "./useSubjectIndex";

const INDEX: SubjectIndex = {
    subjects: [{ value: { id: "1", slug: "derecho-penal", name: "Derecho penal" }, count: 3 }],
    formats: [{ value: "articulo", count: 3 }],
    topics: [],
};

const serve = (answer: () => unknown) => {
    serveEndpoint("/api/subjects", answer);
};

const setUp = () =>
    withSetup(() => useSubjectIndex()).then(
        ({ value }) => ({ controller: value, failure: undefined }),
        (failure: unknown) => ({ controller: undefined, failure }),
    );

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

describe("useSubjectIndex", () => {
    it("reads the subject index route", async () => {
        serve(() => INDEX);
        const { controller } = await setUp();

        expect(controller?.index.value).toEqual(INDEX);
    });

    // Thrown during setup, so server rendering answers with the route's own status
    it("throws a fatal page error with the route's status when the index can't be read", async () => {
        serve(() => new Response("Bad gateway", { status: 502 }));

        expect((await setUp()).failure).toMatchObject({ status: 502, fatal: true });
    });
});
