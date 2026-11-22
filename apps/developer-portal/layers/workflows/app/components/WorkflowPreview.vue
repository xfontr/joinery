<template>
    <WorkflowGlyph :map :label="$t('workflowTeaser.glyphLabel')" />
</template>

<script setup lang="ts">
import { GLYPH_MAP, projectMap } from "#layers/workflows/shared/workflows.ts";
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
}

const { view } = defineProps<Props>();

const map = computed(() => projectMap(view, GLYPH_MAP));
</script>
