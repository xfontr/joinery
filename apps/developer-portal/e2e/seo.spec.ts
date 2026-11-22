import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { NOT_FOUND, VISITOR_PAGES } from "./copy.ts";

const SITE_NAME = "Developer portal";

// Read straight off the server, so these answer for the prerendered HTML a crawler gets
test.describe("@any-width", () => {
    for (const path of VISITOR_PAGES) {
        test(`${path} carries its own title, description, canonical and card`, async ({
            request,
        }) => {
            const html = await (await request.get(path)).text();
            const meta = (attribute: string, name: string) =>
                new RegExp(`<meta[^>]*${attribute}="${name}"[^>]*content="([^"]*)"`).exec(
                    html,
                )?.[1];

            const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
            expect(title.split(SITE_NAME)).toHaveLength(2);
            expect(meta("name", "description")).toBeTruthy();
            expect(meta("property", "og:title")).toBe(title);
            expect(meta("name", "robots")).toMatch(/^index, follow/);

            const canonical = /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/.exec(html)?.[1];
            expect(new URL(canonical ?? "").pathname).toBe(path);
            expect(meta("name", "twitter:card")).toBe("summary_large_image");

            // A share card whose image 404s renders as a bare link, so the file must be served
            const image = new URL(meta("property", "og:image") ?? "");
            expect(image.origin).toBe(new URL(canonical ?? "").origin);
            expect((await request.get(image.pathname)).ok()).toBe(true);
            expect(meta("property", "og:url")).toBe(canonical);
        });
    }

    test("a case study shares its own screenshot, not the default card", async ({ request }) => {
        const html = await (await request.get("/work/huella-legal/")).text();
        const image = /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/.exec(html)?.[1];

        expect(new URL(image ?? "").pathname).toMatch(/^\/_nuxt\/huella-legal\.[\w-]+\.jpg$/);
    });

    test("no two visitor pages share a description", async ({ request }) => {
        const descriptions = await Promise.all(
            VISITOR_PAGES.map(async (path) => {
                const html = await (await request.get(path)).text();
                return /<meta[^>]*name="description"[^>]*content="([^"]*)"/.exec(html)?.[1];
            }),
        );

        expect(new Set(descriptions).size).toBe(VISITOR_PAGES.length);
    });

    test("the front page names the person behind it in its structured data", async ({
        request,
    }) => {
        const html = await (await request.get("/")).text();
        const graph = (
            JSON.parse(
                /<script type="application\/ld\+json"[^>]*>([^<]*)<\/script>/.exec(html)?.[1] ??
                    "{}",
            ) as { "@graph"?: { "@type": string; name?: string }[] }
        )["@graph"];

        expect(graph).toContainEqual(expect.objectContaining({ "@type": "Person" }));
    });

    test("the developer view stays out of search, though its links are still followed", async ({
        request,
    }) => {
        for (const path of ["/overview/", "/wiki/", "/decisions/", "/coverage/", "/workflows/"]) {
            const html = await (await request.get(path)).text();

            expect(html, path).toMatch(/<meta[^>]*name="robots"[^>]*content="noindex, follow"/);
        }
    });

    test("the sitemap lists exactly the visitor pages", async ({ request }) => {
        const xml = await (await request.get("/sitemap.xml")).text();
        const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
            ([, loc]) => new URL(loc ?? "").pathname,
        );

        expect(paths.sort()).toEqual([...VISITOR_PAGES].sort());
    });

    test("robots.txt points crawlers at the sitemap", async ({ request }) => {
        const robots = await (await request.get("/robots.txt")).text();

        expect(robots).toMatch(/^Sitemap: .+\/sitemap\.xml$/m);
    });

    test("a missing page answers 404", async ({ request }) => {
        expect((await request.get("/no-such-page/")).status()).toBe(404);
    });
});

test.describe(() => {
    test.use({ allowedConsole: [NOT_FOUND] });

    test("a missing page asks not to be indexed", async ({ page }) => {
        await page.goto("/no-such-page/");

        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    });
});
