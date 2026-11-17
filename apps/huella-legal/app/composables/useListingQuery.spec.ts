import { withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { describe, expect, it, vi } from "vitest";
import { useRouter } from "vue-router";
import { useListingQuery } from "./useListingQuery";

const queryAt = async (route: string) => {
    const { value } = await withSetup(
        () => {
            const router = useRouter();

            return { router, query: useListingQuery({ page: "1", sort: "newest" }) };
        },
        { route },
    );
    const { query, router } = value;

    return {
        ...query,
        router,
        href: (patch: Parameters<typeof query.link>[0]) => router.resolve(query.link(patch)).href,
    };
};

describe("useListingQuery", () => {
    it("restarts at page one on any change, so a filter never lands past its last page", async () => {
        const { href } = await queryAt("/publicaciones/?page=3&format=comentario");

        expect(href({ format: "articulo" })).toBe("/publicaciones/?format=articulo");
    });

    it("leaves a value equal to its default out of the URL, so each listing has one address", async () => {
        const { href } = await queryAt("/publicaciones/?sort=oldest");

        expect(href({ page: "1" })).toBe("/publicaciones/?sort=oldest");
        expect(href({ sort: "newest" })).toBe("/publicaciones/");
    });

    it("navigates to the link it would build", async () => {
        const { navigate, router } = await queryAt("/publicaciones/?page=2");

        await navigate({ sort: "oldest" });

        await vi.waitFor(() =>
            expect(router.currentRoute.value.fullPath).toBe("/publicaciones/?sort=oldest"),
        );
    });
});
