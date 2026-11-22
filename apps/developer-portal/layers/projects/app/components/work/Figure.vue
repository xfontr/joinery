<template>
    <UContainer as="figure" class="pb-16">
        <img
            v-bind="screenshot"
            sizes="(min-width: 72rem) 72rem, 100vw"
            fetchpriority="high"
            :alt="work.screenshot.alt"
            :style="carriedShot"
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
    </UContainer>
</template>

<script setup lang="ts">
import type { WorkCase } from "#layers/projects/app/types/WorkCase.ts";

interface Props {
    work: WorkCase;
}

const { work } = defineProps<Props>();

const screenshot = computed(() => workScreenshot(work));
const carriedShot = computed(() => carried(`work-shot-${work.slug}`));
</script>
