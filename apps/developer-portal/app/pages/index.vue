<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10 md:pt-20">
        <h1 class="font-display text-title text-highlighted md:text-statement">
            Built by <mark>rules.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Websites for small publications and practices, and the tools that keep them running.
        </p>
        <p class="max-w-xl text-base text-muted">
            AI agents do the heavy lifting under rules written by hand, and every decision is made
            in the open. The result is for the people who read and use these sites, not for the
            machine.
        </p>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <p class="pb-6 font-mono text-xs text-muted uppercase">Five rules, and their proof</p>
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
            <ULink :to="item.to" class="flex flex-col gap-1 self-end md:col-span-3">
                <span class="font-mono text-xs text-muted uppercase">Proof</span>
                <span
                    class="text-base text-highlighted underline decoration-primary underline-offset-4"
                >
                    {{ item.proof }} →
                </span>
            </ULink>
        </article>
    </section>

    <section id="workflows" class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <ULink
            to="/how-its-run"
            class="group grid items-center gap-10 border-t border-accented pt-10 md:grid-cols-12"
        >
            <div class="flex flex-col gap-5 md:col-span-6">
                <p class="font-mono text-xs text-muted uppercase">Rule 3, in practice</p>
                <h2 class="font-display text-section text-highlighted md:text-title">
                    Every project <mark>runs on a map.</mark>
                </h2>
                <p class="max-w-md text-lg text-default">
                    One map that people and AI agents work from together. Each block knows what it
                    waits on, so work starts in the right order.
                </p>
                <span
                    class="font-display text-2xl text-highlighted underline decoration-primary underline-offset-8 group-hover:text-primary"
                >
                    See how projects are run →
                </span>
            </div>
            <div v-if="glyph" class="flex justify-center md:col-span-6">
                <WorkflowGlyph
                    :map="glyph"
                    label="A real project plan: every block, and what each one waits on"
                />
            </div>
        </ULink>
    </section>

    <section id="work" class="bg-muted">
        <div class="mx-auto max-w-6xl px-4 py-20 md:px-10">
            <h2 class="font-display text-section text-highlighted md:text-title">
                What the rules <mark>made</mark>
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
                            Read the story
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
        what: "A review desk for site-wide edits to a WordPress site.",
        stage: "In use, runs on one computer",
        story: null,
        cta: "Read how it works",
        href: "/wiki/apps/wp-editor/readme",
        shot: null,
    },
    {
        slug: "portal",
        name: "This portal",
        kind: "The workshop",
        what: "The open front door to everything above.",
        stage: "Being redesigned, starting with this page",
        story: null,
        cta: "Open the developer view",
        href: "/overview",
        shot: null,
    },
];

const DEEPER = [
    { kicker: "Go deeper", title: "How it's made, rule by rule", to: "/method" },
    { kicker: "A case", title: "Huella Legal, start to finish", to: `/work/${huella.slug}` },
    { kicker: "The craft", title: "Careful, and measured", to: "/craft" },
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
        line: "No template. Every design starts from award-juried sites, studied and measured.",
        proof: benchmarks.value.length
            ? `${benchmarks.value.length} sites studied before anything was drawn`
            : "The sites studied before anything was drawn",
        to: "/decisions/0039-developer-portal-benchmark",
    },
    {
        rule: "Write the decision down.",
        line: "Any question that could go either way gets a short answer anyone can read later.",
        proof: "Will every old link to Huella Legal still work? Yes; here's how",
        to: "/decisions/0028-huella-legal-urls-and-cutover",
    },
    {
        rule: "Plan the whole job.",
        line: "A project is a map of what has to happen and what waits on what, before the first ticket.",
        proof: "How every project is planned, just below",
        to: "#workflows",
    },
    {
        rule: "Let agents build. Let rules decide.",
        line: "AI agents write the code. Tests, lint rules and three reviewers decide what's merged.",
        proof: "How the agents are set up",
        to: "/wiki/docs/concepts/agent-setup",
    },
    {
        rule: "Prove it, every time.",
        line: "Speed, accessibility and behaviour are checked by machines on every change, not promised.",
        proof: rules.value
            ? `${rules.value.enabled} lint rules on every change, ${rules.value.inHouse} written in-house`
            : "What the machines check on every change",
        to: "/craft",
    },
]);

const glyph = computed(() => {
    const view = workflows.value.projects.find((project) => project.project.id === PLAN);
    return view ? projectMap(view, GLYPH_MAP) : null;
});
</script>
