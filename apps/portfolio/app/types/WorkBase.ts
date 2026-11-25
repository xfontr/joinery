/** What every entry under `content/work/` carries, listed on the front page and at `/work`. */
export interface WorkBase {
    slug: string;
    name: string;
    kind: string;
    /** Where the work stands, as the front page lists it. */
    stage: string;
    line: string;
    /** A path in `href` is a page on the developer portal. */
    live: { href: string; label: string };
    /** A file in `app/assets/work/`, captured at 1440 × 900; required of a study, optional for a tool. */
    screenshot?: { file: string; alt: string; caption: string };
    /** Still being built, so a screenshot may show the site it replaces. */
    inProgress?: boolean;
}
