<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10 md:pt-20">
        <p class="font-mono text-xs text-muted uppercase">Agentic workflows</p>
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            One map. <mark>People and agents.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Every project starts from a template that already knows the job: each block it needs,
            what each waits on, and the mistakes earlier projects made. The map says what can start
            now, files the work as tickets, and redraws itself as tickets close.
        </p>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <ol class="grid gap-10 border-t border-accented pt-10 md:grid-cols-5">
            <li v-for="(step, index) in STEPS" :key="step.title" class="flex flex-col gap-3">
                <span class="font-display text-section text-primary">{{ index + 1 }}</span>
                <span class="font-display text-2xl text-highlighted">{{ step.title }}</span>
                <span class="text-base">{{ step.body }}</span>
            </li>
        </ol>
    </section>

    <section class="bg-muted">
        <div class="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 md:px-10">
            <h2 class="font-display text-section text-highlighted">
                Every project, <mark>live</mark>
            </h2>
            <article v-for="item in maps" :key="item.id" class="flex flex-col gap-5">
                <div
                    class="flex flex-col gap-2 border-t border-accented pt-6 md:flex-row md:items-baseline md:justify-between"
                >
                    <h3 class="font-display text-heading text-highlighted">{{ item.title }}</h3>
                    <p class="font-mono text-sm text-muted">{{ item.counts }}</p>
                </div>
                <WorkflowProjectMap :map="item.map" :label="`${item.title} as a map of blocks`" />
                <ULink
                    :to="`/workflows/${item.id}`"
                    class="self-start text-primary underline underline-offset-4"
                >
                    Open it live, ticket by ticket →
                </ULink>
            </article>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-20 md:px-10">
        <div class="grid gap-6 md:grid-cols-12">
            <h2 class="font-display text-section text-highlighted md:col-span-5">
                Rules, <mark>paid for once</mark>
            </h2>
            <p class="self-end text-base md:col-span-6 md:col-start-7">
                Every rule the maps enforce exists because a real project tripped on it. The ticket
                numbers are the receipts.
            </p>
        </div>
        <ul class="mt-10 flex flex-col">
            <li
                v-for="item in RULES"
                :key="item.rule"
                class="grid gap-2 border-t border-default py-6 md:grid-cols-12"
            >
                <span class="font-display text-2xl text-highlighted md:col-span-5">
                    {{ item.rule }}
                </span>
                <span class="text-base text-muted md:col-span-7">{{ item.paid }}</span>
            </li>
        </ul>
        <ULink to="/workflows" class="mt-6 inline-block text-primary underline underline-offset-4">
            All workflows, templates and settings, in the developer view →
        </ULink>
    </section>
</template>

<script setup lang="ts">
import { projectMap } from "#layers/workflows/shared/workflows.ts";

definePageMeta({ layout: "visitor" });
useHead({ title: "Agentic workflows" });

const STEPS = [
    {
        title: "A template knows the job",
        body: "A website rebuild already holds every block such a project needs, from the content audit to the domain cutover, with what each one waits on.",
    },
    {
        title: "The map says what can start",
        body: "Order comes from what each block needs, not from phases. Anything with nothing left to wait on can begin today.",
    },
    {
        title: "Questions before tickets",
        body: "Work is filed only once nothing it depends on is undecided. Calls only a person can make are marked as theirs, and wait for them.",
    },
    {
        title: "Agents take what's ready",
        body: "AI agents pick up open tickets, the ones that unblock the most first. Each closed ticket moves the map forward.",
    },
    {
        title: "The next project learns",
        body: "What went wrong becomes a lesson in the template, with the ticket that taught it, so the next project starts already knowing.",
    },
];

const RULES = [
    {
        rule: "Answer the questions before filing the work.",
        paid: "Build tickets were once filed the night before the final design (#208), and a newsletter provider was swapped after it was wired (#242 → #299).",
    },
    {
        rule: "Unknowns go first.",
        paid: "Hosting was decided on paper and changed five times (#186, #244, #302, #377).",
    },
    {
        rule: "A change of host is its own decision.",
        paid: "A hosting switch slipped in under a lint ticket and was reverted two days later (#377, #378).",
    },
    {
        rule: "Deploy work is checked on a real deploy.",
        paid: "Four bugs only a real deploy could show (#382, #387, #388, #395).",
    },
    {
        rule: "A blocked ticket can't be picked.",
        paid: "Otherwise an agent could start from a plan that went stale an hour earlier; the pick command reads the links live and refuses.",
    },
];

const { data } = await useWorkflows();

const maps = computed(() =>
    data.value.projects.map((view) => {
        const map = projectMap(view);
        const blocks = `${map.blocks.done} of ${map.blocks.total} blocks done · ${map.blocks.moving} moving`;
        return {
            id: view.project.id,
            title: view.project.title,
            map,
            counts: map.tickets
                ? `${blocks} · ${map.tickets.closed} of ${map.tickets.total} tickets closed`
                : blocks,
        };
    }),
);
</script>
