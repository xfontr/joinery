const SOURCES = import.meta.glob<string>("../assets/work/*.jpg", {
    eager: true,
    import: "default",
    query: { w: "1440", format: "webp" },
});

const SRCSETS = import.meta.glob<string>("../assets/work/*.jpg", {
    eager: true,
    import: "default",
    query: { w: "480;960;1440", format: "webp", as: "srcset" },
});

const SHARES = import.meta.glob<string>("../assets/work/*.jpg", {
    eager: true,
    import: "default",
    query: { w: "1200", h: "630", fit: "cover", position: "top", format: "jpg" },
});

/** A case study's screenshot as WebP at three widths, for an `<img>` to bind with `v-bind`. */
export const workScreenshot = (work: {
    screenshot?: { file: string };
}): { src: string; srcset: string } | undefined => {
    const key = work.screenshot && `../assets/work/${work.screenshot.file}`;
    const src = key && SOURCES[key];

    return src ? { src, srcset: SRCSETS[key] ?? src } : undefined;
};

/** A case study's screenshot cropped from the top to 1200×630, the size share cards render. */
export const workShareImage = (work: { screenshot?: { file: string } }): string | undefined =>
    work.screenshot && SHARES[`../assets/work/${work.screenshot.file}`];
