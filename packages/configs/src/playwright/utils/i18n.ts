import { createI18n } from "vue-i18n";

type Messages = Record<string, unknown>;

// vue-i18n types messages by schema, and a locale file read as JSON has none
type AnyMessages = NonNullable<Parameters<typeof createI18n>[0]["messages"]>;

/**
 * A `t` over one locale's messages, worded by vue-i18n itself, that throws on a key the messages
 * lack instead of printing the key, so a spec naming a control by its key fails when the key goes.
 */
export const createT = (messages: Messages, locale = "es-ES") => {
    const i18n = createI18n({
        legacy: false,
        locale,
        messages: { [locale]: messages } as AnyMessages,
        missing: (_, key) => {
            throw new Error(`No message for "${key}" in ${locale}`);
        },
        missingWarn: false,
        fallbackWarn: false,
    });

    return (key: string, named: Record<string, unknown> = {}, plural?: number): string =>
        plural === undefined ? i18n.global.t(key, named) : i18n.global.t(key, named, plural);
};

// A host such as `www.revista.es` or an address's domain is never a key, so a path can't follow one
const DOTTED_PATH = /(?<![\w.@/-])[A-Z_][\w-]*(?:\.[\w-]+)+/gi;

/**
 * The dotted paths printed in `text` that start with one of the messages' namespaces, which is
 * what vue-i18n renders for a key it lacks, a key built from a variable included.
 */
export const rawKeysIn = (text: string, messages: Messages): string[] => {
    const namespaces = new Set(
        Object.entries(messages)
            .filter(([, value]) => value !== null && typeof value === "object")
            .map(([key]) => key),
    );

    return [...new Set(text.match(DOTTED_PATH) ?? [])].filter((path) =>
        namespaces.has(path.split(".")[0]!),
    );
};
