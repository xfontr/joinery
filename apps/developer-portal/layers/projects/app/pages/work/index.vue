<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
        <p class="font-mono text-xs text-muted uppercase">Work</p>
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            What the rules <mark>made.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Each site, case by case: who it serves, what changed, and the decisions behind it.
        </p>
    </section>

    <section class="mx-auto flex max-w-6xl flex-col px-4 md:px-10">
        <ULink
            v-for="item in WORK"
            :key="item.slug"
            :to="`/work/${item.slug}`"
            class="group grid gap-6 border-t border-accented py-10 md:grid-cols-12 md:gap-10"
        >
            <img
                :src="SCREENSHOTS[`../../assets/work/${item.screenshot.file}`]"
                :alt="item.screenshot.alt"
                width="1440"
                height="900"
                class="w-full border border-default md:col-span-7"
            />
            <div class="flex flex-col gap-3 md:col-span-5">
                <p class="font-mono text-xs text-muted uppercase">{{ item.kind }}</p>
                <h2 class="font-display text-section text-highlighted group-hover:text-primary">
                    {{ item.name }}
                </h2>
                <p class="text-lg">{{ item.line }}</p>
                <p class="font-mono text-sm text-muted">{{ item.facts.join(" · ") }}</p>
                <span class="mt-2 text-primary underline underline-offset-4">
                    Read the case →
                </span>
            </div>
        </ULink>
    </section>
</template>

<script setup lang="ts">
import { WORK } from "#layers/projects/shared/work.ts";

definePageMeta({ layout: "visitor" });
useHead({ title: "Work" });

const SCREENSHOTS = import.meta.glob<string>("../../assets/work/*.jpg", {
    eager: true,
    import: "default",
});
</script>
