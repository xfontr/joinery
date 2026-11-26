<template>
    <figure>
        <img
            v-bind="screenshot"
            sizes="(min-width: 48rem) 50vw, 100vw"
            fetchpriority="high"
            :alt="work.screenshot.alt"
            :style="carriedShot"
            width="1440"
            height="900"
            class="shot"
        />
        <figcaption class="mt-3 font-mono text-meta text-muted">
            {{ work.screenshot.caption }}
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import type { WorkCase } from "~/types/WorkCase";

interface Props {
    work: WorkCase;
}

const { work } = defineProps<Props>();

const screenshot = computed(() => workScreenshot(work));
const carriedShot = computed(() => carried(`work-shot-${work.slug}`));
</script>
