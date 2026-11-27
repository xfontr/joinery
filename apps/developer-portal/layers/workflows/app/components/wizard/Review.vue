<template>
    <div class="flex flex-col gap-6">
        <dl class="divide-y divide-default rounded-xl border border-default">
            <div
                v-for="row in rows"
                :key="row.label"
                class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-6"
            >
                <dt class="w-32 shrink-0 text-sm text-muted">{{ row.label }}</dt>
                <dd class="text-sm">{{ row.value }}</dd>
            </div>
        </dl>

        <section v-if="preview" class="rounded-2xl border border-default">
            <header class="border-b border-default px-4 py-3">
                <h2 class="text-sm font-semibold">{{ $t("wizardReview.graph") }}</h2>
            </header>
            <WorkflowGraph
                :capabilities="preview.capabilities"
                :stages="preview.stages"
                :selected="picked"
                class="rounded-t-none"
                @select="pick"
                @clear="picked = null"
            />
        </section>
    </div>
</template>

<script setup lang="ts">
import type { ProjectView, ReviewRow } from "#layers/workflows/shared/workflows.ts";

interface Props {
    rows: ReviewRow[];
    preview: ProjectView | null;
}

const { rows, preview } = defineProps<Props>();

const picked = ref<string | null>(null);
const pick = (id: string) => {
    picked.value = picked.value === id ? null : id;
};
</script>
