import { describe, expect, it } from "vitest";
import messages from "../../../../i18n/locales/es-ES.json";
import { FORMAT_KEYS } from "./formatKeys";

// Every place that labels a format builds its key from FORMAT_KEYS, which the missing-keys lint
// cannot follow through a template literal
const LABELLED_AT = [
    "article.formats",
    "articleListing.formats",
    "homeFeatured.formats",
    "homeSubjects.formats",
    "navPublicationsPanel.formats",
    "subjectsFormats.formats",
];

const lookup = (path: string) =>
    path
        .split(".")
        .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], messages);

describe("FORMAT_KEYS", () => {
    it.each(LABELLED_AT)("has a label under %s for every format", (prefix) => {
        for (const key of Object.values(FORMAT_KEYS)) {
            expect(lookup(`${prefix}.${key}`), `${prefix}.${key}`).toBeDefined();
        }
    });
});
