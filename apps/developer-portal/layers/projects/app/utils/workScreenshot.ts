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

/** A case study's screenshot as WebP at three widths, for an `<img>` to bind with `v-bind`. */
export const workScreenshot = (work: {
    screenshot?: { file: string };
}): { src: string; srcset: string } | undefined => {
    const key = work.screenshot && `../assets/work/${work.screenshot.file}`;
    const src = key && SOURCES[key];

    return src ? { src, srcset: SRCSETS[key] ?? src } : undefined;
};
