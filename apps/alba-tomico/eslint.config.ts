import { eslint } from "@joinery/configs";

const COLOUR_UTILITIES =
    "(bg|text|border(-[xytrbles])?|divide|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|decoration|accent|caret|shadow|inset-shadow|drop-shadow|placeholder)";

export default [
    ...eslint.createNuxtConfig(),
    eslint.tailwind("layers/design/app/assets/main.css"),
    {
        files: ["**/*.vue", "**/*.ts"],
        rules: {
            "better-tailwindcss/no-restricted-classes": [
                "error",
                {
                    restrict: [
                        {
                            // Every step, Tailwind's own palettes included; `!` is v4's important
                            // marker, either side
                            pattern: `(^|:)!?${COLOUR_UTILITIES}-[a-z]+(-[a-z]+)*-(50|[1-9]00|950)(/|!|$)`,
                            message:
                                '"$0" names a palette step: use bg-default/inverted, text-default/inverted or border-default/inverted.',
                        },
                        {
                            pattern: `(^|:)!?${COLOUR_UTILITIES}-(paper|ink|white|black)(/|!|$)`,
                            message:
                                '"$0" names a colour, which the invert toggle cannot swap: use bg-default/inverted or text-default/inverted.',
                        },
                        {
                            // A bare word in brackets is a CSS named colour; a type hint other than
                            // `color:` in the paren form marks a size, so it stays allowed
                            pattern: String.raw`(^|:)!?${COLOUR_UTILITIES}-(\((color:)?--|\[(#|rgb|hsl|oklch|oklab|lab|lch|hwb|color|var|--|[a-z]+\]))`,
                            message:
                                '"$0" hard-codes a colour: use a Nuxt UI role, or add the token to main.css.',
                        },
                        {
                            pattern: String.raw`(^|:)!?(text|leading|tracking)-\[`,
                            message:
                                '"$0" hard-codes a type value: add a --text-* token to main.css.',
                        },
                        {
                            pattern: "(^|:)!?text-(xs|sm|base|lg|[2-9]xl)(/|!|$)",
                            message:
                                "\"$0\" is Tailwind's type scale, not the site's: use text-m, text-l, text-xl, text-xxl or text-status.",
                        },
                        {
                            // Zero stays allowed, since `inset-0` and `top-0` carry no size
                            pattern: String.raw`(^|:)!?-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end)-([1-9]|0\.|px(/|!|$)|\[|\()`,
                            message:
                                '"$0" hard-codes a spacing value: use s, m or l, or add a --spacing-* token to main.css.',
                        },
                        {
                            pattern: String.raw`(^|:)!?-?z-(\d|\[|\()`,
                            message: '"$0" hard-codes a z-index: use z-s, z-m, z-l, z-xl or z-xxl.',
                        },
                    ],
                },
            ],
        },
    },
];
