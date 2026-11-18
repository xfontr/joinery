<template>
    <ShellIdea page="Huella Legal">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-10 pb-12 md:px-10 md:pt-20">
            <p class="font-mono text-xs text-muted uppercase">A case · {{ item.kind }}</p>
            <h1 class="font-serif text-7xl leading-none text-highlighted md:text-9xl">
                Huella <em class="text-primary">Legal</em>
            </h1>
            <p class="max-w-2xl text-2xl text-highlighted">{{ item.what }}</p>
            <p class="font-mono text-sm text-muted">{{ factsLine }}</p>
        </section>

        <figure class="mx-auto max-w-6xl px-5 pb-16 md:px-10">
            <img
                :src="item.shot ?? undefined"
                alt="Huella Legal's new home page"
                width="1440"
                height="900"
                class="w-full border border-default"
            />
            <figcaption class="mt-3 flex justify-between gap-4 text-sm text-muted">
                <span>The new home page, on staging.</span>
                <a :href="item.href" class="text-primary underline">{{ item.cta }}</a>
            </figcaption>
        </figure>

        <section class="mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:grid-cols-12 md:px-10">
            <p class="font-serif text-4xl/tight text-highlighted md:col-span-7">
                {{ item.why }}
            </p>
            <div class="flex flex-col gap-4 text-base text-muted md:col-span-4 md:col-start-9">
                <p v-for="paragraph in huella.story" :key="paragraph">{{ paragraph }}</p>
            </div>
        </section>

        <section class="bg-muted">
            <div class="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3 md:px-10">
                <div v-for="row in huella.design" :key="row.label" class="flex flex-col gap-2">
                    <span class="font-mono text-xs text-muted uppercase">{{ row.label }}</span>
                    <span class="font-serif text-3xl/tight text-highlighted">{{ row.value }}</span>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-6xl px-5 pt-16 md:px-10">
            <h2 class="pb-8 font-serif text-5xl leading-none text-highlighted">
                Decided <em>before</em> building
            </h2>
            <NuxtLink
                v-for="decision in huellaDecisions"
                :key="decision.id"
                :to="`/decisions/${decision.id}`"
                class="group grid gap-2 border-t border-default py-6 md:grid-cols-12"
            >
                <span
                    class="font-serif text-2xl/tight text-highlighted group-hover:text-primary md:col-span-6"
                >
                    {{ decision.question }}
                </span>
                <span class="text-base text-muted md:col-span-6">{{ decision.answer }}</span>
            </NuxtLink>
        </section>
    </ShellIdea>
</template>

<script setup lang="ts">
import ShellIdea from "~/lab/idea/ShellIdea.vue";
import { decisions, huella, work } from "~/lab/fixtures";

definePageMeta({ layout: false });

const item = work[0]!;
const huellaDecisions = decisions.filter((decision) => decision.id.includes("huella"));
const factsLine = huella.facts
    .map((fact) =>
        fact.label === "Plan" ? fact.value : `${fact.value} ${fact.label.toLowerCase()}`,
    )
    .join(" · ");
</script>
