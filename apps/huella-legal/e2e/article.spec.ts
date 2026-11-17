import { expectNoAxeViolations } from "@monorepo/configs/playwright/utils/a11y";
import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { t } from "./copy.ts";
import { ARTICLE, POSTS, REFERENCE, SECTIONS } from "./fakes.ts";

// The TOC rail replaces the accordion from Tailwind's `lg` up
const DESKTOP = 1024;

const PATH = `/${ARTICLE.slug}/`;

test("reads the whole article: title, byline, sections, notes, bibliography and citation", async ({
    page,
    baseURL,
}) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(ARTICLE.title);
    await expect(page.getByRole("link", { name: ARTICLE.authors[0]?.name }).first()).toBeVisible();

    for (const section of SECTIONS)
        await expect(page.getByRole("heading", { level: 2, name: section })).toBeVisible();

    await expect(
        page.getByRole("region", { name: t("articleNotes.title") }).getByRole("listitem"),
    ).toHaveCount(2);
    await expect(page.getByRole("region", { name: t("articleBibliography.title") })).toContainText(
        REFERENCE,
    );
    await expect(page.getByRole("region", { name: t("citeBox.title") })).toContainText(
        new URL(PATH, baseURL).href,
    );
});

test("moves the bibliography out of the text, so its heading isn't in the TOC", async ({
    page,
}) => {
    await page.goto(PATH);

    const wide = (page.viewportSize()?.width ?? 0) >= DESKTOP;
    const toc = page.getByRole("navigation", { name: t("articleToc.title") });

    if (!wide) {
        const trigger = toc.getByRole("button", { name: t("articleToc.title") });

        // CI's runner can click before hydration, which focuses the trigger without opening it
        await expect(async () => {
            if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();

            await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 500 });
        }).toPass();
    }

    await expect(toc.getByRole("link")).toHaveText(SECTIONS);
});

test("a note reference and its back-link lead to each other", async ({ page }) => {
    await page.goto(PATH);

    await page.locator("#ref-1").click();
    await expect(page).toHaveURL(/#nota-1$/);

    await page.getByRole("link", { name: "Nota 1, volver al texto" }).click();
    await expect(page).toHaveURL(/#ref-1$/);
});

test("relates the other posts in its category", async ({ page }) => {
    await page.goto(PATH);

    const siblings = POSTS.filter(
        (post) => post !== ARTICLE && post.terms[0]?.id === ARTICLE.terms[0]?.id,
    );
    const related = page.getByRole("region", { name: `También en ${ARTICLE.terms[0]?.name}` });

    await expect(related.locator("ol > li")).toHaveCount(Math.min(3, siblings.length));
});

test("opens a related post in place, with its own title", async ({ page }) => {
    await page.goto(PATH);

    const link = page
        .getByRole("region", { name: `También en ${ARTICLE.terms[0]?.name}` })
        .getByRole("listitem")
        .first()
        .getByRole("heading")
        .getByRole("link");
    const title = (await link.textContent())?.trim() ?? "";

    await link.click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test("the article page has no WCAG AA violations", async ({ page }) => {
    await page.goto(PATH);

    await expectNoAxeViolations(page);
});
