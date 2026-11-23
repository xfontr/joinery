import { eslint } from "@monorepo/configs";

const bracketedValue = {
    pattern: String.raw`^.*-\[.*\]$`,
    message: '"$0" hard-codes a value: use the scale, or add a token to main.css.',
};

const rawPalette = {
    pattern:
        "(^|:)(bg|text|border|divide|ring|outline|decoration|fill|stroke|from|via|to|shadow|accent|caret|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|paper|terracotta)-[0-9]{2,3}(/|$)|(^|:)(bg|text|border|divide|ring|outline|decoration|fill|stroke)-(black|white)(/|$)",
    message:
        '"$0" is a raw palette colour: use a role such as bg-default, text-muted or border-accented.',
};

export default [
    ...eslint.createNuxtConfig(),
    eslint.tailwind("app/assets/main.css"),
    eslint.i18nKeys("i18n/locales/*.json"),
    {
        // The plugin is only registered for these, so a rule set outside them fails on any `.js`.
        files: ["**/*.vue", "**/*.ts"],
        rules: {
            "better-tailwindcss/no-unknown-classes": [
                "error",
                { ignore: ["^tone-(good|warn|bad)$"] },
            ],
            "better-tailwindcss/no-restricted-classes": [
                "error",
                { restrict: [bracketedValue, rawPalette] },
            ],
        },
    },

    {
        // Pages that predate the length cap; drop a path once its page is split into sections.
        files: [
            "app/pages/index.vue",
            "app/pages/method.vue",
            "app/pages/agentic-workflows.vue",
            String.raw`app/pages/work/\[app\].vue`,
        ],
        rules: { "vue/max-lines-per-block": "warn" },
    },
];
