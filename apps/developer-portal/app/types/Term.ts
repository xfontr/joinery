export interface Term {
    id: string;
    term: string;
    detail: string;
    /** A route for each bold phrase in `detail` that should link, keyed by the phrase. */
    links?: Readonly<Record<string, string>>;
}
