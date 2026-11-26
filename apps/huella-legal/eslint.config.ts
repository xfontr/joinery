import { eslint } from "@joinery/configs";

export default [
    ...eslint.createNuxtConfig(),
    eslint.routeMeta,
    eslint.tailwind("layers/design/app/assets/main.css"),
    eslint.i18nKeys("i18n/locales/*.json"),
    eslint.layerBoundaries({
        cores: ["articles", "forms", "design"],
        kit: [
            "app/components/base/",
            "app/components/listing/",
            "app/types/",
            "app/utils/",
            "app/composables/",
            "i18n/",
        ],
    }),
    {
        files: ["**/*.vue", "**/*.ts"],
        rules: {
            "better-tailwindcss/no-unknown-classes": [
                "error",
                { ignore: ["^hl-", "^error__debug$"] },
            ],
            "better-tailwindcss/no-restricted-classes": [
                "error",
                {
                    restrict: [
                        {
                            pattern:
                                "(^|:)(bg-(ivory-(50|100|200)|huella-slate-900)|text-(ivory-50|huella-teal-600|huella-ink-(500|600|700)|huella-slate-900)|(border|divide|ring)-(ivory-(200|300)|huella-slate-(300|900)))(/|$)",
                            message:
                                '"$0" repeats a role: use bg-default/muted/accented/inverted, text-inverted/secondary/dimmed/muted/default/highlighted or border-muted/default/accented/inverted.',
                        },
                        {
                            pattern: String.raw`(^|:)(text|leading|tracking)-\[`,
                            message:
                                '"$0" hard-codes a type value: add a --text-* or --tracking-* token to main.css.',
                        },
                    ],
                },
            ],
        },
    },
];
