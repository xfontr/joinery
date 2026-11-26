import { eslint } from "@joinery/configs";

export default [
    ...eslint.createNuxtConfig(),
    eslint.tailwind("app/assets/css/main.css"),
    {
        // Pages that predate the length cap; drop a path once its page is split into sections.
        files: [
            String.raw`app/pages/changesets/\[id\].vue`,
            "app/pages/index.vue",
            "app/pages/settings.vue",
        ],
        rules: { "vue/max-lines-per-block": "warn" },
    },
];
