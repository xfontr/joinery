<template>
    <span v-if="words !== null" class="text-xs text-muted">
        {{ words }} words · updated {{ updated }}
    </span>
    <code class="font-mono text-xs text-dimmed">{{ source }}</code>
</template>

<script setup lang="ts">
interface Props {
    /** The repo path of the markdown file. */
    source: string;
    /** Left out when the doc isn't in the snapshot. */
    words?: number | null;
    updatedAt?: string | null;
}

const { source, words = null, updatedAt = null } = defineProps<Props>();

const updated = computed(() => relativeTime(updatedAt));
</script>
