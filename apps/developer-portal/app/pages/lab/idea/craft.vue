<template>
    <ShellIdea page="The craft">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-10 pb-16 md:px-10 md:pt-20">
            <p class="font-mono text-xs text-muted uppercase">Rule 5, in practice</p>
            <h1 class="font-serif text-7xl leading-none text-highlighted md:text-9xl">
                Careful, <em class="text-primary">and measured.</em>
            </h1>
            <p class="max-w-2xl text-2xl text-highlighted">{{ craft.lead }}</p>
        </section>

        <section class="mx-auto max-w-6xl px-5 pb-8 md:px-10">
            <article
                v-for="(item, index) in craft.items"
                :key="item.area"
                class="grid gap-4 border-t border-accented py-10 md:grid-cols-12"
            >
                <p class="flex items-baseline gap-3 md:col-span-3 md:flex-col md:gap-2">
                    <span class="font-serif text-5xl leading-none text-primary">{{
                        index + 1
                    }}</span>
                    <span class="font-mono text-xs text-muted uppercase">{{ item.area }}</span>
                </p>
                <div class="flex flex-col gap-3 md:col-span-6">
                    <h2 class="font-serif text-4xl/tight text-highlighted">
                        {{ item.claim }}
                    </h2>
                    <p class="max-w-xl text-lg">{{ item.how }}</p>
                </div>
                <NuxtLink :to="item.to" class="self-end md:col-span-3">
                    <span
                        class="text-base text-highlighted underline decoration-primary underline-offset-4"
                    >
                        {{ item.cta }} →
                    </span>
                </NuxtLink>
            </article>
        </section>
    </ShellIdea>
</template>

<script setup lang="ts">
import ShellIdea from "~/lab/idea/ShellIdea.vue";
import { craft } from "~/lab/fixtures";

definePageMeta({ layout: false });
</script>
