<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
        <p class="font-mono text-xs text-muted uppercase">Rule by rule</p>
        <h1 class="font-display text-title text-highlighted md:text-statement">
            How it's <mark>made</mark>
        </h1>
    </section>

    <section :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">1</span>
            <h2 class="font-display text-section text-highlighted">Look before drawing.</h2>
        </header>
        <div class="flex flex-col gap-8 md:col-span-8">
            <p class="text-xl text-highlighted">{{ sources }}</p>
            <p v-if="sites" class="font-mono text-sm/loose text-muted">{{ sites }}</p>
            <ul class="flex flex-col">
                <li
                    v-for="lesson in LESSONS"
                    :key="lesson"
                    class="border-t border-default py-3 font-display text-2xl text-highlighted"
                >
                    {{ lesson }}
                </li>
            </ul>
        </div>
    </section>

    <section :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">2</span>
            <h2 class="font-display text-section text-highlighted">Write the decision down.</h2>
        </header>
        <div class="flex flex-col md:col-span-8">
            <ULink
                v-for="item in DECISIONS"
                :key="item.id"
                :to="`/decisions/${item.id}`"
                class="group flex flex-col gap-2 border-t border-default py-6 first:border-t-0 first:pt-0"
            >
                <span class="font-display text-3xl/tight text-highlighted group-hover:text-primary">
                    {{ item.question }}
                </span>
                <span class="max-w-xl text-base text-muted">{{ item.answer }}</span>
            </ULink>
        </div>
    </section>

    <section :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">3</span>
            <h2 class="font-display text-section text-highlighted">Plan the whole job.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">{{ planLead }}</p>
            <ol v-if="stages.length" class="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                <li v-for="(stage, index) in stages" :key="stage.id" class="flex flex-col gap-1">
                    <span class="font-mono text-xs text-primary">0{{ index + 1 }}</span>
                    <span class="font-display text-2xl text-highlighted">{{ stage.title }}</span>
                    <span class="text-sm text-muted">{{ stage.goal }}</span>
                </li>
            </ol>
            <ULink
                :to="`/workflows/${PLAN}`"
                class="self-start text-primary underline underline-offset-4"
            >
                The whole plan, ticket by ticket →
            </ULink>
        </div>
    </section>

    <section :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">4</span>
            <h2 class="font-display text-section text-highlighted">
                Let agents build. Let rules decide.
            </h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                From ticket to merge with no person reading the code, and
                {{ PIPELINE.length }} chances to stop and ask for one.
            </p>
            <ol class="flex flex-col">
                <li
                    v-for="item in PIPELINE"
                    :key="item.step"
                    class="grid gap-1 border-t border-default py-4 sm:grid-cols-4"
                >
                    <span class="font-display text-2xl text-highlighted">{{ item.step }}</span>
                    <span class="text-base sm:col-span-3">{{ item.does }}</span>
                </li>
            </ol>
        </div>
    </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "visitor" });
useHead({ title: "How it's made" });

const SECTION =
    "mx-auto grid max-w-6xl gap-8 border-t border-accented px-4 py-14 md:grid-cols-12 md:px-10";
const RULE = "flex items-baseline gap-4 md:col-span-4 md:flex-col md:items-start";

const PLAN = "huella-legal";

const LESSONS = [
    "One sentence carries the first screen.",
    "Lists of work as numbered rows, not cards.",
    "One accent colour, spent on one job.",
    "Nothing waits on animation to be read.",
];

const DECISIONS = [
    {
        question: "Will every old link to the magazine still work after the move?",
        answer: "Yes. Every post, page, author and topic address was listed from the live site and given a new home or a redirect.",
        id: "0028-huella-legal-urls-and-cutover",
    },
    {
        question: "Where should the new magazine run, and what will it cost?",
        answer: "Both candidate hosts were built against for real; cost is written as a formula, because no traffic figure existed to guess from.",
        id: "0030-huella-legal-rendering-hosting-and-cost",
    },
    {
        question: "Should the magazine share one design system with every other site?",
        answer: "No. Huella Legal owns its look; a shared package was retired rather than filled on speculation.",
        id: "0036-huella-legal-owns-its-design-system",
    },
    {
        question: "How does a visitor who doesn't write code enter this portal?",
        answer: "Straight into the visitor view, with the developer view one click away. Measured against a 'choose your door' page, which cost every visitor a click.",
        id: "0040-developer-portal-visitor-structure",
    },
];

const PIPELINE = [
    {
        step: "Pick",
        does: "Takes the next ticket and reads everything it points at.",
    },
    {
        step: "Plan",
        does: "A planner agent decides which files change, each copying an existing example.",
    },
    {
        step: "Build",
        does: "An agent writes the change, then lint, types and tests run.",
    },
    {
        step: "Review",
        does: "Three reviewers read it in parallel: architecture, correctness, tests.",
    },
    {
        step: "Polish",
        does: "Comments are trimmed and docs checked against the code.",
    },
    {
        step: "Ship",
        does: "Commits, opens the pull request, waits for CI to merge it.",
    },
];

const [{ data: benchmarks }, { data: workflows }] = await Promise.all([
    useBenchmarks(),
    useWorkflows(),
]);

const sources = computed(() =>
    benchmarks.value.length
        ? `${benchmarks.value.length} sites from juried galleries, each studied and measured on the same dimensions before anything was drawn.`
        : "Sites from juried galleries, each studied and measured on the same dimensions before anything was drawn.",
);
const sites = computed(() => benchmarks.value.map((item) => item.title).join(" · "));

const stages = computed(
    () => workflows.value.projects.find((view) => view.project.id === PLAN)?.stages ?? [],
);
const planLead = computed(() =>
    stages.value.length
        ? `Huella Legal's rebuild, in ${stages.value.length} stages.`
        : "Huella Legal's rebuild, mapped before the first ticket.",
);
</script>
