import { axeViolations } from "@monorepo/configs/playwright/utils/a11y";
import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { t } from "./copy.ts";
import { POSTS, SUBJECT, TAG } from "./fakes.ts";

test.beforeEach(async ({ page }) => {
    const response = await page.goto("/areas/");

    expect(response?.status()).toBe(200);
});

test("the subjects index links every subject with posts", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Áreas");

    const grid = page.getByRole("region", { name: t("categories.title") });

    const subjects = new Set(POSTS.flatMap(({ terms }) => terms[0]?.name ?? []));

    await expect(grid.getByRole("link")).toHaveText([...subjects].sort());
    await expect(grid.getByRole("link", { name: SUBJECT.name })).toHaveAttribute(
        "href",
        `/areas/${SUBJECT.slug}/`,
    );
    await expect(grid).toContainText(SUBJECT.description ?? "");
});

test("the formats band leads to the archive filtered by each format, thesis included", async ({
    page,
}) => {
    const band = page.getByRole("region", { name: "Formatos" });

    await expect(band.getByRole("listitem")).toHaveCount(3);

    await band.getByRole("link", { name: /TFG y TFM/ }).click();

    await expect(page).toHaveURL(/\/publicaciones\/\?format=tfg-tfm$/);
});

test("the A to Z links each topic to its tag, without the thesis marker", async ({ page }) => {
    const topics = page.getByRole("region", { name: t("subjectsTopics.title") });

    await expect(topics.getByRole("link", { name: new RegExp(`^${TAG.name}\\s`) })).toHaveAttribute(
        "href",
        `/etiquetas/${TAG.slug}/`,
    );
    await expect(topics.getByRole("link", { name: /Trabajos de fin de grado/ })).toHaveCount(0);
});

test("the on-page links jump to each section", async ({ page }) => {
    await page
        .getByRole("navigation", { name: t("subjectsSectionNav.label") })
        .getByRole("link", { name: /temas$/ })
        .click();

    await expect(page).toHaveURL(/#temas$/);
    await expect(page.getByRole("heading", { name: t("subjectsTopics.title") })).toBeInViewport();
});

test("the subjects index has no WCAG AA violations", async ({ page }, testInfo) => {
    await testInfo.attach(`areas-${testInfo.project.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
    });
    expect(await axeViolations(page)).toEqual([]);
});
