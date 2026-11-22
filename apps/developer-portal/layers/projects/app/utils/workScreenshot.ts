const SCREENSHOTS = import.meta.glob<string>("../assets/work/*.jpg", {
    eager: true,
    import: "default",
});

export const workScreenshot = (work: { screenshot?: { file: string } }): string | undefined =>
    work.screenshot ? SCREENSHOTS[`../assets/work/${work.screenshot.file}`] : undefined;
