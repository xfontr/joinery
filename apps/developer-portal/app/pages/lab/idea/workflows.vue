<template>
    <ShellIdea page="Workflows">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-10 pb-16 md:px-10 md:pt-20">
            <p class="font-mono text-xs text-muted uppercase">How projects are run</p>
            <h1 class="font-serif text-7xl leading-none text-highlighted md:text-9xl">
                One map. <em class="text-primary">People and agents.</em>
            </h1>
            <p class="max-w-2xl text-2xl text-highlighted">{{ workflows.lead }}</p>
        </section>

        <section class="mx-auto max-w-6xl px-5 pb-20 md:px-10">
            <ol class="grid gap-10 border-t border-accented pt-10 md:grid-cols-5">
                <li
                    v-for="(step, index) in workflows.steps"
                    :key="step.title"
                    class="flex flex-col gap-3"
                >
                    <span class="font-serif text-6xl leading-none text-primary">{{
                        index + 1
                    }}</span>
                    <span class="font-serif text-2xl/tight text-highlighted">{{ step.title }}</span>
                    <span class="text-base">{{ step.body }}</span>
                </li>
            </ol>
        </section>

        <section class="bg-muted">
            <div class="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-20 md:px-10">
                <h2 class="font-serif text-6xl leading-none text-highlighted">
                    Every project, <em>live</em>
                </h2>
                <article v-for="item in maps" :key="item.id" class="flex flex-col gap-5">
                    <div
                        class="flex flex-col gap-2 border-t border-accented pt-6 md:flex-row md:items-baseline md:justify-between"
                    >
                        <h3 class="font-serif text-4xl leading-none text-highlighted">
                            {{ item.title }}
                        </h3>
                        <p class="font-mono text-sm text-muted">
                            {{ item.map.blocks.done }} of {{ item.map.blocks.total }} blocks done ·
                            {{ item.map.blocks.moving }} moving · {{ item.map.tickets.done }} of
                            {{ item.map.tickets.total }} tickets closed
                        </p>
                    </div>
                    <LabWorkflowMap :map="item.map" :label="`${item.title} as a map of blocks`" />
                    <NuxtLink
                        :to="`/workflows/${item.id}`"
                        class="self-start text-primary underline underline-offset-4"
                    >
                        Open it live, ticket by ticket →
                    </NuxtLink>
                </article>
            </div>
        </section>

        <section class="mx-auto max-w-6xl px-5 pt-20 md:px-10">
            <div class="grid gap-6 md:grid-cols-12">
                <h2 class="font-serif text-6xl leading-none text-highlighted md:col-span-5">
                    Rules, <em class="text-primary">paid for once</em>
                </h2>
                <p class="self-end text-lg md:col-span-6 md:col-start-7">
                    Every rule the maps enforce exists because a real project tripped on it. The
                    ticket numbers are the receipts.
                </p>
            </div>
            <ul class="mt-10 flex flex-col">
                <li
                    v-for="item in workflows.rules"
                    :key="item.rule"
                    class="grid gap-2 border-t border-default py-6 md:grid-cols-12"
                >
                    <span class="font-serif text-3xl/tight text-highlighted md:col-span-5">
                        {{ item.rule }}
                    </span>
                    <span class="text-base text-muted md:col-span-7">{{ item.paid }}</span>
                </li>
            </ul>
            <NuxtLink
                to="/workflows"
                class="mt-6 inline-block text-primary underline underline-offset-4"
            >
                All workflows, templates and settings, in the developer view →
            </NuxtLink>
        </section>
    </ShellIdea>
</template>

<script setup lang="ts">
import ShellIdea from "~/lab/idea/ShellIdea.vue";
import { workflows } from "~/lab/fixtures";
import LabWorkflowMap from "~/lab/LabWorkflowMap.vue";
import { layoutMap } from "~/lab/workflowMap";

definePageMeta({ layout: false });

const { data } = await useWorkflows();
const maps = computed(() =>
    data.value.projects.map((view) => ({
        id: view.project.id,
        title: view.project.title,
        map: layoutMap(view),
    })),
);
</script>
