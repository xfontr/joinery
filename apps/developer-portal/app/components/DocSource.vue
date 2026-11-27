<template>
    <span v-if="words !== null" class="text-xs text-muted">
        {{ $t("docSource.meta", { words, updated }) }}
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

const { t } = useI18n();

const updated = computed(() =>
    updatedAt ? calendarDay(updatedAt.slice(0, 10)) : t("common.never"),
);
</script>
