<template>
    <span class="text-xs text-muted">{{ read }}</span>
    <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="xs"
        :loading="reloading"
        :aria-label="$t('healthIssuesRead.refresh')"
        @click="emit('refresh')"
    />
</template>

<script setup lang="ts">
interface Props {
    /** When the browser last read GitHub; empty before the first read. */
    fetchedAt: string;
    reloading: boolean;
}

const { fetchedAt, reloading } = defineProps<Props>();
const emit = defineEmits<{ refresh: [] }>();

const { t } = useI18n();

const read = computed(() =>
    fetchedAt
        ? t("healthIssuesRead.read", { age: relativeTime(fetchedAt, t) })
        : t("healthIssuesRead.notRead"),
);
</script>
