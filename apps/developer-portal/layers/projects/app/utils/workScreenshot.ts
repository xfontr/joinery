import type { Work } from "../../shared/types/Work.ts";

const SCREENSHOTS = import.meta.glob<string>("../assets/work/*.jpg", {
    eager: true,
    import: "default",
});

export const workScreenshot = (work: Work): string | undefined =>
    SCREENSHOTS[`../assets/work/${work.screenshot.file}`];
