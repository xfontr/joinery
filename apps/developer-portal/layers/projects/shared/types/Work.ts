/** A shipped app's visitor page at `/work/<slug>`. */
export interface Work {
    slug: string;
    name: string;
    /** The headline is `title`, then `mark` in the accent. */
    title: string;
    mark: string;
    kind: string;
    line: string;
    why: string;
    story: readonly string[];
    facts: readonly string[];
    countedOn: string;
    design: readonly { label: string; value: string }[];
    /** A file in `layers/projects/app/assets/work/`, captured at 1440 × 900. */
    screenshot: { file: string; alt: string; caption: string };
    live: { href: string; label: string };
    decisions: readonly { id: string; question: string; answer: string }[];
}
