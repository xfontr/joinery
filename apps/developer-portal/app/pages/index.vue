<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10 md:pt-20">
        <h1 class="font-display text-title text-highlighted md:text-statement">
            Built by <mark>rules.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Websites for small publications and practices, and the tools that run them.
        </p>
        <p class="max-w-xl text-base text-muted">
            AI agents write most of the code. I write the rules they follow, and every decision is
            public.
        </p>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <p class="pb-6 font-mono text-xs text-muted uppercase">Five rules</p>
        <article
            v-for="(item, index) in principles"
            :key="item.rule"
            class="grid gap-4 border-t border-accented py-10 md:grid-cols-12"
        >
            <p class="font-display text-title text-primary md:col-span-2">{{ index + 1 }}</p>
            <div class="flex flex-col gap-4 md:col-span-7">
                <h2 class="font-display text-section text-highlighted">{{ item.rule }}</h2>
                <p class="max-w-xl text-lg">{{ item.line }}</p>
            </div>
            <ULink
                :to="item.to"
                class="self-end text-base text-highlighted underline decoration-primary underline-offset-4 md:col-span-3"
            >
                {{ item.proof }} →
            </ULink>
        </article>
    </section>

    <section id="workflows" class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <ULink
            to="/agentic-workflows"
            class="group grid items-center gap-10 border-t border-accented pt-10 md:grid-cols-12"
        >
            <div class="flex flex-col gap-5 md:col-span-6">
                <p class="font-mono text-xs text-muted uppercase">Agentic workflows</p>
                <h2 class="font-display text-section text-highlighted md:text-title">
                    Project <mark>maps</mark>
                </h2>
                <p class="max-w-md text-lg text-default">
                    This one is Huella Legal's. Each block lists what it waits on, and agents start
                    whatever is free.
                </p>
                <span
                    class="font-display text-2xl text-highlighted underline decoration-primary underline-offset-8 group-hover:text-primary"
                >
                    See the live maps →
                </span>
            </div>
            <div v-if="glyph" class="flex justify-center md:col-span-6">
                <WorkflowGlyph :map="glyph" label="Huella Legal's project map" />
            </div>
        </ULink>
    </section>

    <section id="work" class="bg-muted">
        <div class="mx-auto max-w-6xl px-4 py-20 md:px-10">
            <h2 class="font-display text-section text-highlighted md:text-title">
                Sites and <mark>tools</mark>
            </h2>
            <div class="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
                <article
                    v-for="item in WORK_LIST"
                    :key="item.slug"
                    class="flex flex-col gap-3"
                    :class="item.shot && 'md:col-span-3 md:grid md:grid-cols-3 md:gap-x-10'"
                >
                    <img
                        v-if="item.shot"
                        :src="item.shot"
                        :alt="`${item.name}, the new site`"
                        width="1440"
                        height="900"
                        class="w-full border border-default md:col-span-2 md:row-span-6"
                    />
                    <p class="font-mono text-xs text-muted uppercase">
                        {{ item.kind }} · {{ item.stage }}
                    </p>
                    <h3 class="font-display text-heading text-highlighted">{{ item.name }}</h3>
                    <p class="text-base">{{ item.what }}</p>
                    <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <ULink
                            v-if="item.story"
                            :to="item.story"
                            class="text-primary underline underline-offset-4"
                        >
                            Read the case study
                        </ULink>
                        <ULink :to="item.href" class="underline underline-offset-4">
                            {{ item.cta }}
                        </ULink>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-6 px-4 pt-20 md:grid-cols-3 md:px-10">
        <ULink
            v-for="item in DEEPER"
            :key="item.to"
            :to="item.to"
            class="flex flex-col gap-2 border-t border-default pt-5"
        >
            <span class="font-mono text-xs text-muted uppercase">{{ item.kicker }}</span>
            <span class="font-display text-3xl/tight text-highlighted">{{ item.title }} →</span>
        </ULink>
    </section>
</template>

<script setup lang="ts">
import huellaShot from "#layers/projects/app/assets/work/huella-legal.jpg";
import { workFor } from "#layers/projects/shared/work.ts";
import { GLYPH_MAP, projectMap } from "#layers/workflows/shared/workflows.ts";

definePageMeta({ layout: "visitor" });
useHead({ title: "Built by rules" });

const PLAN = "huella-legal";
const IN_HOUSE = "monorepo/";

const huella = workFor("huella-legal")!;
const marina = workFor("marina-roustan")!;

const WORK_LIST = [
    {
        slug: huella.slug,
        name: huella.name,
        kind: huella.kind,
        what: huella.line,
        stage: "Redesign on staging",
        story: `/work/${huella.slug}`,
        cta: huella.live.label,
        href: huella.live.href,
        shot: huellaShot,
    },
    {
        slug: marina.slug,
        name: marina.name,
        kind: marina.kind,
        what: marina.line,
        stage: "In design",
        story: `/work/${marina.slug}`,
        cta: marina.live.label,
        href: marina.live.href,
        shot: null,
    },
    {
        slug: "wp-editor",
        name: "WP Editor",
        kind: "Editing tool",
        what: "Claude proposes bulk edits to a WordPress blog. I review each one as a diff before it goes live, and can undo it later.",
        stage: "In use, runs locally",
        story: null,
        cta: "Read the docs",
        href: "/wiki/apps/wp-editor/readme",
        shot: null,
    },
    {
        slug: "portal",
        name: "This portal",
        kind: "Developer portal",
        what: "The site you're reading, plus the dashboards I run the repo from.",
        stage: "Mid-redesign",
        story: null,
        cta: "Open the developer view",
        href: "/overview",
        shot: null,
    },
];

const DEEPER = [
    { kicker: "Method", title: "Five rules, all automated", to: "/method" },
    { kicker: "Agentic workflows", title: "Live project maps", to: "/agentic-workflows" },
    { kicker: "Work", title: "Case studies", to: "/work" },
];

const [{ data: benchmarks }, { data: usage }, { data: workflows }] = await Promise.all([
    useBenchmarks(),
    useSnapshot("usage"),
    useWorkflows(),
]);

const rules = computed(() => {
    const all = usage.value?.usage?.lint.rules;
    if (!all) return null;
    const enabled = Object.entries(all).filter(([, rule]) => rule.enabled);
    return enabled.length
        ? {
              enabled: enabled.length,
              inHouse: enabled.filter(([name]) => name.startsWith(IN_HOUSE)).length,
          }
        : null;
});

const principles = computed(() => [
    {
        rule: "Look before drawing.",
        line: "Each design starts from a study of award-winning sites.",
        proof: benchmarks.value.length
            ? `${benchmarks.value.length} sites studied`
            : "The sites studied",
        to: "/decisions/0039-developer-portal-benchmark",
    },
    {
        rule: "Write decisions down.",
        line: "Any call that could go either way gets a short report anyone can read.",
        proof: "Keeping Huella Legal's old links working",
        to: "/decisions/0028-huella-legal-urls-and-cutover",
    },
    {
        rule: "Plan the whole job.",
        line: "Before the first ticket, I map every task and what it waits on.",
        proof: "The project map, below",
        to: "#workflows",
    },
    {
        rule: "Let agents write the code.",
        line: "Tests, lint rules and three review agents decide what gets merged. I step in when they ask.",
        proof: "Agent setup",
        to: "/wiki/docs/concepts/agent-setup",
    },
    {
        rule: "Check every change.",
        line: "Tests, accessibility and lint rules run on every change.",
        proof: rules.value
            ? `${rules.value.enabled} lint rules, ${rules.value.inHouse} written in-house`
            : "What gets checked",
        to: "/method#prove",
    },
]);

const glyph = computed(() => {
    const view = workflows.value.projects.find((project) => project.project.id === PLAN);
    return view ? projectMap(view, GLYPH_MAP) : null;
});
</script>
