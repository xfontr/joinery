import { axeViolations } from "@monorepo/configs/playwright/utils/a11y";
import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { t } from "./copy.ts";
import { POSTS } from "./fakes.ts";

// Tailwind's `md` to `lg`, where the three-card grid drops its orphan
const TWO_COLUMNS = { from: 768, to: 1024 };

const NEWEST = [...POSTS].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
const titles = NEWEST.map(({ title }) => title);

const THESES = NEWEST.filter(({ terms }) =>
    terms.some(({ slug }) => slug === "trabajos-de-fin-de-grado"),
);

test.beforeEach(async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
});

test("opens with the journal's statement", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Derecho riguroso, escrito para ser leído.",
    );
    await expect(page).toHaveTitle("Huella Legal");
});

test("leads with the newest post and lists the next five, without repeating it", async ({
    page,
}) => {
    const featured = page.getByRole("region", { name: t("homeFeatured.label") });

    await expect(
        featured.getByRole("article").getByRole("heading", { level: 2 }).getByRole("link"),
    ).toHaveText(titles[0]!);
    await expect(
        featured
            .getByRole("complementary", { name: t("homeFeatured.latest.title") })
            .getByRole("listitem")
            .getByRole("link"),
    ).toHaveText(titles.slice(1, 6));
});

test("follows with the three posts after those", async ({ page }) => {
    const width = page.viewportSize()?.width ?? 0;
    const shown = width >= TWO_COLUMNS.from && width < TWO_COLUMNS.to ? 2 : 3;

    await expect(
        page
            .getByRole("region", { name: t("homeRecent.title") })
            .getByRole("heading", { level: 3 }),
    ).toHaveText(titles.slice(6, 6 + shown));
});

test("links every subject with posts to its listing", async ({ page }) => {
    const subjects = new Set(POSTS.flatMap(({ terms }) => terms[0]?.name ?? []));

    await expect(
        page
            .getByRole("region", { name: t("homeSubjects.title") })
            .getByRole("list")
            .getByRole("link"),
    ).toHaveCount(subjects.size);
});

test("shows the newest theses and leads to the rest", async ({ page }) => {
    const band = page.getByRole("region", { name: t("homeTheses.title") });

    await expect(band.getByRole("listitem")).toHaveCount(3);
    await expect(band.getByRole("listitem").first()).toContainText(THESES[0]!.title);

    await band.getByRole("link", { name: t("homeTheses.all") }).click();

    await expect(page).toHaveURL(/\/publicaciones\/\?format=tfg-tfm$/);
});

// Every "subscribe" link in the header targets this anchor
test("ends with the newsletter band at #newsletter", async ({ page }) => {
    await expect(page.locator("#newsletter")).toHaveAccessibleName(
        "Un correo al mes con lo que hemos publicado. Nada más.",
    );
});

test("the home page has no WCAG AA violations", async ({ page }, testInfo) => {
    await testInfo.attach(`home-${testInfo.project.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
    });
    expect(await axeViolations(page)).toEqual([]);
});
