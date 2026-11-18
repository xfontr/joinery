<template>
    <ShellIdea page="How it's made">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-10 pb-12 md:px-10 md:pt-20">
            <p class="font-mono text-xs text-muted uppercase">Rule by rule</p>
            <h1 class="font-serif text-7xl leading-none text-highlighted md:text-8xl">
                How it's <em class="text-primary">made</em>
            </h1>
        </section>

        <section
            class="mx-auto grid max-w-6xl gap-8 border-t border-accented px-5 py-14 md:grid-cols-12 md:px-10"
        >
            <header class="flex gap-4 md:col-span-4 md:flex-col">
                <span class="font-serif text-7xl leading-none text-primary">1</span>
                <h2 class="font-serif text-4xl leading-none text-highlighted">
                    {{ principles[0]!.rule }}
                </h2>
            </header>
            <div class="flex flex-col gap-8 md:col-span-8">
                <p class="text-xl text-highlighted">{{ benchmark.sources }}</p>
                <p class="font-mono text-sm/loose text-muted">{{ sites }}</p>
                <ul class="flex flex-col">
                    <li
                        v-for="row in benchmark.taken"
                        :key="row.what"
                        class="flex items-baseline justify-between gap-4 border-t border-default py-3"
                    >
                        <span class="font-serif text-2xl text-highlighted">{{ row.what }}</span>
                        <span class="shrink-0 font-mono text-xs text-muted">{{ row.seen }}</span>
                    </li>
                </ul>
            </div>
        </section>

        <section
            class="mx-auto grid max-w-6xl gap-8 border-t border-accented px-5 py-14 md:grid-cols-12 md:px-10"
        >
            <header class="flex gap-4 md:col-span-4 md:flex-col">
                <span class="font-serif text-7xl leading-none text-primary">2</span>
                <h2 class="font-serif text-4xl leading-none text-highlighted">
                    {{ principles[1]!.rule }}
                </h2>
            </header>
            <div class="flex flex-col md:col-span-8">
                <NuxtLink
                    v-for="item in decisions"
                    :key="item.id"
                    :to="`/decisions/${item.id}`"
                    class="group flex flex-col gap-2 border-t border-default py-6 first:border-t-0 first:pt-0"
                >
                    <span
                        class="font-serif text-3xl/tight text-highlighted group-hover:text-primary"
                    >
                        {{ item.question }}
                    </span>
                    <span class="max-w-xl text-base text-muted">{{ item.answer }}</span>
                </NuxtLink>
            </div>
        </section>

        <section
            class="mx-auto grid max-w-6xl gap-8 border-t border-accented px-5 py-14 md:grid-cols-12 md:px-10"
        >
            <header class="flex gap-4 md:col-span-4 md:flex-col">
                <span class="font-serif text-7xl leading-none text-primary">3</span>
                <h2 class="font-serif text-4xl leading-none text-highlighted">
                    {{ principles[2]!.rule }}
                </h2>
            </header>
            <div class="flex flex-col gap-6 md:col-span-8">
                <p class="text-xl text-highlighted">{{ plan.name }}, in six stages.</p>
                <ol class="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                    <li
                        v-for="(stage, index) in plan.stages"
                        :key="stage.name"
                        class="flex flex-col gap-1"
                    >
                        <span class="font-mono text-xs text-primary">0{{ index + 1 }}</span>
                        <span class="font-serif text-2xl text-highlighted">{{ stage.name }}</span>
                        <span class="text-sm text-muted">{{ stage.goal }}</span>
                    </li>
                </ol>
                <NuxtLink
                    to="/workflows/huella-legal"
                    class="text-primary underline underline-offset-4"
                >
                    The whole plan, ticket by ticket
                </NuxtLink>
            </div>
        </section>

        <section
            class="mx-auto grid max-w-6xl gap-8 border-t border-accented px-5 py-14 md:grid-cols-12 md:px-10"
        >
            <header class="flex gap-4 md:col-span-4 md:flex-col">
                <span class="font-serif text-7xl leading-none text-primary">4</span>
                <h2 class="font-serif text-4xl leading-none text-highlighted">
                    {{ principles[3]!.rule }}
                </h2>
            </header>
            <div class="flex flex-col gap-6 md:col-span-8">
                <p class="text-xl text-highlighted">
                    From ticket to merge with no person reading the code, and six chances to stop
                    and ask for one.
                </p>
                <ol class="flex flex-col">
                    <li
                        v-for="item in pipeline"
                        :key="item.step"
                        class="grid gap-1 border-t border-default py-4 sm:grid-cols-4"
                    >
                        <span class="font-serif text-2xl text-highlighted">{{ item.step }}</span>
                        <span class="text-base sm:col-span-3">{{ item.does }}</span>
                    </li>
                </ol>
            </div>
        </section>
    </ShellIdea>
</template>

<script setup lang="ts">
import ShellIdea from "~/lab/idea/ShellIdea.vue";
import { benchmark, decisions, pipeline, plan, principles } from "~/lab/fixtures";

definePageMeta({ layout: false });

const sites = benchmark.sites.join(" · ");
</script>
