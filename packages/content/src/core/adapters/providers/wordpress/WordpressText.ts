import { decodeHTML } from "entities";

const TAG = /<[^<>]*>/g;

/** Display text from WordPress's entity-escaped titles, names and bios; not a sanitiser. */
export const toPlainText = (html: string): string =>
    decodeHTML(html.replaceAll(TAG, "")).replaceAll(/\s+/g, " ").trim();

// A tag becomes a space here, since two paragraphs end and start a word.
export const countWords = (html: string): number =>
    decodeHTML(html.replaceAll(TAG, " ")).split(/\s+/).filter(Boolean).length;
