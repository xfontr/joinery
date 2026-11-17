import { eslint } from "@monorepo/configs";

export default [
    ...eslint.createNuxtConfig(),
    eslint.tailwind("layers/design/app/assets/main.css"),
    // Throwaway screenshot scripts for the design lab, which never ships
    { ignores: [".bench-shots.mjs", ".lab-*.mjs"] },
    {
        files: ["**/*.vue", "**/*.ts"],
        rules: {
            "better-tailwindcss/no-restricted-classes": [
                "error",
                {
                    restrict: [
                        {
                            // Every step, Tailwind's own palettes included, so colour only
                            // arrives through a role; `!` is v4's important marker, either side
                            pattern:
                                "(^|:)!?(bg|text|border(-[xytrbl])?|divide|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|decoration|accent|caret|shadow|inset-shadow|drop-shadow|placeholder)-[a-z]+(-[a-z]+)*-(50|[1-9]00|950)(/|!|$)",
                            message:
                                '"$0" names a palette step: use bg-default/muted/elevated/accented/inverted, text-dimmed/muted/toned/default/highlighted/inverted/primary/secondary/error or border-muted/default/accented/inverted.',
                        },
                        {
                            pattern: String.raw`(^|:)!?(text|leading|tracking)-\[`,
                            message:
                                '"$0" hard-codes a type value: add a --text-* or --tracking-* token to main.css.',
                        },
                        {
                            // A bare word in brackets is a CSS named colour; a type hint other than
                            // `color:` in the paren form marks a size, so it stays allowed
                            pattern: String.raw`(^|:)!?(bg|text|border(-[xytrbles])?|divide|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|decoration|accent|caret|shadow|inset-shadow|drop-shadow|placeholder)-(\((color:)?--|\[(#|rgb|hsl|oklch|oklab|lab|lch|hwb|color|var|--|[a-z]+\]))`,
                            message:
                                '"$0" hard-codes a colour: use a Nuxt UI role, or add the token to main.css.',
                        },
                    ],
                },
            ],
        },
    },
];
