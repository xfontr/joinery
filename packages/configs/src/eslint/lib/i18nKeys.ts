import vueI18n from "@intlify/eslint-plugin-vue-i18n";

const COPY_ATTRIBUTES = [
    "alt",
    "aria-label",
    "description",
    "label",
    "placeholder",
    "title",
    "/^(action|empty|help|hint|kicker|lead|mark|meta|note|provenance)/",
];

const i18nKeys = (localeDir: string): object => ({
    files: ["**/*.vue", "**/*.ts"],
    ignores: ["**/*.spec.ts", "**/*.stories.ts", "**/e2e/**"],
    plugins: { "@intlify/vue-i18n": vueI18n },
    rules: {
        "@intlify/vue-i18n/no-missing-keys": "error",
        "@intlify/vue-i18n/no-raw-text": [
            "error",
            {
                ignorePattern: String.raw`^[\s\d\p{P}\p{S}]*$`,
                attributes: { "/.+/": COPY_ATTRIBUTES },
            },
        ],
    },
    settings: { "vue-i18n": { localeDir, messageSyntaxVersion: "^11.0.0" } },
});

export default i18nKeys;
