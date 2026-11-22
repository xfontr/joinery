<template>
    <figure class="mx-auto max-w-6xl px-4 pb-16 md:px-10">
        <img
            :src="screenshot"
            :alt="work.screenshot.alt"
            width="1440"
            height="900"
            class="w-full border border-default"
        />
        <figcaption
            class="mt-3 flex flex-col gap-1 text-sm text-muted md:flex-row md:justify-between"
        >
            <span>{{ work.screenshot.caption }}</span>
            <ULink :to="work.live.href" class="text-primary underline underline-offset-4">
                {{ work.live.label }}
            </ULink>
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import type { WorkCase } from "#layers/projects/app/types/WorkCase.ts";

interface Props {
    work: WorkCase;
}

const { work } = defineProps<Props>();

const screenshot = computed(() => workScreenshot(work));
</script>
