/** What every entry under `content/work/` carries, listed on the front page and at `/work`. */
export interface WorkBase {
    slug: string;
    name: string;
    kind: string;
    /** Where the work stands, as the front page lists it. */
    stage: string;
    line: string;
    live: { href: string; label: string };
}
