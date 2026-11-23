import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { afterEach, describe, expect, it } from "vitest";
import type { SiteData } from "~/types/SiteData";

const DATA_URL = "https://portal.test/embed/data.json";

const DATA = {
    benchmarks: [{ id: "rauno-me", title: "rauno.me", screenshot: "/shots/rauno-me.webp" }],
    decisions: [],
    workflows: { projects: [], templates: [], lessons: 7 },
    rules: { enabled: 2, inHouse: 1 },
    specs: 42,
} satisfies SiteData;

const read = async <T>(use: () => Promise<{ data: { value: T } }>) => {
    const { value } = await withSetup(async () => {
        const { data } = await use();
        return { data };
    });
    return value.data.value;
};

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("useSiteData", () => {
    it("builds every figure empty when no payload URL is set, as a local build does", async () => {
        expect(await read(useSpecTotal)).toBeNull();
        expect(await read(useWorkflowTemplates)).toEqual({ templates: [], lessons: 0 });
    });

    it("reads each figure off the portal's payload", async () => {
        useRuntimeConfig().public.dataUrl = DATA_URL;
        serveEndpoint(DATA_URL, () => DATA);

        expect(await read(useSpecTotal)).toBe(42);
        expect(await read(useRuleCounts)).toEqual({ enabled: 2, inHouse: 1 });
    });

    it("resolves a benchmark screenshot against the portal, since the path is the portal's", async () => {
        useRuntimeConfig().public.dataUrl = DATA_URL;
        serveEndpoint(DATA_URL, () => DATA);

        const [benchmark] = await read(useBenchmarks);

        expect(benchmark?.screenshot).toBe("https://portal.test/shots/rauno-me.webp");
    });

    // A deploy that silently drops every figure is worse than one that fails
    it("fails when a payload URL is set but does not answer", async () => {
        useRuntimeConfig().public.dataUrl = DATA_URL;
        serveEndpoint(DATA_URL, () => {
            throw createError({ status: 503 });
        });

        await expect(read(useSpecTotal)).rejects.toMatchObject({ status: 502 });
    });
});
