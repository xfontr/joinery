<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10 md:pt-20">
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            Agentic <mark>workflows</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            I plan each project as a map of tasks, and AI agents build it ticket by ticket. The maps
            below are the real ones.
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
                Current <mark>projects</mark>
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
                    Open the live map →
                </ULink>
            </article>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-20 md:px-10">
        <div class="grid gap-6 md:grid-cols-12">
            <h2 class="font-display text-section text-highlighted md:col-span-5">
                Lessons from <mark>past projects</mark>
            </h2>
            <p class="self-end text-base md:col-span-6 md:col-start-7">
                Each one cost a real project time. The numbers are the tickets where it happened.
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
            Every workflow, in the developer view →
        </ULink>
    </section>
</template>

<script setup lang="ts">
import { projectMap } from "#layers/workflows/shared/workflows.ts";

definePageMeta({ layout: "visitor" });
useHead({ title: "Agentic workflows" });

const STEPS = [
    {
        title: "Start from a template",
        body: "A ready-made task list for the job: website rebuild, new website, or custom project.",
    },
    {
        title: "Start what's unblocked",
        body: "A task starts once everything it depends on is done.",
    },
    {
        title: "Plan, then file",
        body: "The whole map is agreed before the first ticket goes out.",
    },
    {
        title: "Agents take ready tickets",
        body: "Claude Code agents pick up open tickets, starting with whichever unblocks the most work.",
    },
    {
        title: "Lessons go back in",
        body: "When something goes wrong, I log it in a diary, then use the diary to improve the workflows.",
    },
];

const RULES = [
    {
        rule: "Answer questions before filing work.",
        paid: "Build tickets were filed the night before the final design (#208). A newsletter provider was swapped after it was already wired in (#242 → #299).",
    },
    {
        rule: "Unknowns go first.",
        paid: "Hosting was picked on paper, then changed five times (#186, #244, #302, #377).",
    },
    {
        rule: "Changing host is its own decision.",
        paid: "A hosting switch slipped in under a lint ticket and was reverted two days later (#377, #378).",
    },
    {
        rule: "Test deploy work on a real deploy.",
        paid: "Four bugs only showed up once the site was deployed (#382, #387, #388, #395).",
    },
    {
        rule: "A blocked ticket can't be picked.",
        paid: "Otherwise an agent could start from a plan that changed an hour ago. The pick command checks GitHub first and refuses.",
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
