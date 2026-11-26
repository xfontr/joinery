import { expect, NOT_FOUND_DOCUMENT, test } from "@joinery/configs/playwright/utils/test";
import { rawKeysIn } from "@joinery/configs/playwright/utils/i18n";
import { MESSAGES } from "./copy.ts";
import { ARTICLE, AUTHOR, ESCAPED, HEADING, SUBJECT, TAG } from "./fakes.ts";

test("opens an article by its slug", async ({ page }) => {
    await page.goto(`/${ESCAPED.slug}/`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ESCAPED.title);
    await expect(page.getByRole("heading", { level: 2, name: HEADING })).toBeVisible();
});

test.describe("an unknown slug", () => {
    test.use({ allowedConsole: [NOT_FOUND_DOCUMENT] });

    test("answers an unknown slug with a real 404", async ({ page }) => {
        const response = await page.goto("/no-existe/");

        expect(response?.status()).toBe(404);
    });
});

const PAGES = [
    "/",
    "/publicaciones/",
    "/areas/",
    `/areas/${SUBJECT.slug}/`,
    `/etiquetas/${TAG.slug}/`,
    "/colaboradores/",
    `/colaboradores/${AUTHOR.slug}/`,
    `/${ARTICLE.slug}/`,
    "/sobre/",
    "/publicar/",
    "/contacto/",
    "/calculo-intereses/",
    "/buscar/",
];

for (const path of PAGES) {
    test(`renders every message on ${path}, never a bare key`, async ({ page }) => {
        await page.goto(path);

        expect(rawKeysIn(await page.locator("body").innerText(), MESSAGES)).toEqual([]);
    });
}
