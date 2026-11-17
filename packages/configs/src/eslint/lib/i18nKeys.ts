import vueI18n from "@intlify/eslint-plugin-vue-i18n";

const i18nKeys = (localeDir: string): object => ({
    files: ["**/*.vue", "**/*.ts"],
    ignores: ["**/*.spec.ts", "**/*.stories.ts", "**/e2e/**"],
    plugins: { "@intlify/vue-i18n": vueI18n },
    rules: { "@intlify/vue-i18n/no-missing-keys": "error" },
    settings: { "vue-i18n": { localeDir, messageSyntaxVersion: "^11.0.0" } },
});

export default i18nKeys;
