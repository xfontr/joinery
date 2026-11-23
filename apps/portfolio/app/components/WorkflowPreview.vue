<template>
    <WorkflowGlyph :map :label="$t('workflowTeaser.glyphLabel')" />
</template>

<script setup lang="ts">
import type { ProjectMap } from "~/types/ProjectMap";

interface Props {
    map: ProjectMap;
}

const { map } = defineProps<Props>();
</script>
