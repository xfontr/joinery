import { expect, test } from "@joinery/configs/playwright/utils/test";
import { NOT_FOUND } from "./copy.ts";

// Read straight off the server, so these answer for the prerendered HTML a crawler gets
test.describe("@any-width", () => {
    test("every page stays out of search, though its links are still followed", async ({
        request,
    }) => {
        for (const path of ["/", "/wiki/", "/decisions/", "/coverage/", "/workflows/"].map(
            (path) => `/portal${path}`,
        )) {
            const html = await (await request.get(path)).text();

            expect(html, path).toMatch(/<meta[^>]*name="robots"[^>]*content="noindex, follow"/);
        }
    });

    test("publishes the figures the personal site reads", async ({ request }) => {
        const response = await request.get("/portal/embed/data.json");

        expect(response.ok()).toBe(true);
        expect(Object.keys((await response.json()) as object).sort()).toEqual(
            ["benchmarks", "decisions", "rules", "specs", "workflows"].sort(),
        );
    });

    test("a missing page answers 404", async ({ request }) => {
        expect((await request.get("/portal/no-such-page/")).status()).toBe(404);
    });
});

test.describe(() => {
    test.use({ allowedConsole: [NOT_FOUND] });

    test("a missing page asks not to be indexed", async ({ page }) => {
        await page.goto("/portal/no-such-page/");

        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    });
});
