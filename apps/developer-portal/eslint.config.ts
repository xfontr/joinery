import { eslint } from "@joinery/configs";

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
    eslint.tailwind("layers/design/app/assets/main.css"),
    eslint.i18nKeys("i18n/locales/*.json"),
    eslint.layerBoundaries({
        cores: ["design", "snapshot", "docs", "github"],
        kit: ["app/components/", "app/types/", "app/utils/"],
    }),
    {
        // The plugin is only registered for these, so a rule set outside them fails on any `.js`.
        files: ["**/*.vue", "**/*.ts"],
        rules: {
            "better-tailwindcss/no-unknown-classes": [
                "error",
                {
                    ignore: [
                        "^tone-(good|warn|bad)$",
                        "^(data-table|numeric|embedded-report|widget-wiggle)$",
                        "^(skyline|tower|cell|cards|segment|is-selected|is-highlighted)$",
                    ],
                },
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
            "layers/audits/app/pages/audits/index.vue",
            String.raw`layers/benchmarks/app/pages/benchmarks/\[id\].vue`,
            "layers/benchmarks/app/pages/benchmarks/index.vue",
            String.raw`layers/decisions/app/pages/decisions/\[id\].vue`,
            "layers/decisions/app/pages/decisions/index.vue",
            "layers/health/app/pages/coverage.vue",
            "layers/health/app/pages/deps.vue",
            "layers/health/app/pages/issues.vue",
            "layers/projects/app/pages/changelog.vue",
            "layers/projects/app/pages/graph.vue",
            String.raw`layers/projects/app/pages/projects/\[name\].vue`,
            "layers/projects/app/pages/projects/index.vue",
            "layers/telemetry/app/pages/telemetry.vue",
            String.raw`layers/wiki/app/pages/wiki/\[...slug\].vue`,
            "layers/wiki/app/pages/wiki/index.vue",
            String.raw`layers/workflows/app/pages/workflows/\[id\]/index.vue`,
            String.raw`layers/workflows/app/pages/workflows/\[id\]/settings.vue`,
            "layers/workflows/app/pages/workflows/index.vue",
            "layers/workflows/app/pages/workflows/new.vue",
        ],
        rules: { "vue/max-lines-per-block": "warn" },
    },

    // `pnpm exec nx collect @joinery/developer-portal` vendors Nx's graph client and Istanbul's HTML
    // report in here, minified; the shared `**/coverage` ignore only catches half of it.
    { ignores: ["public/embed/**"] },
];
