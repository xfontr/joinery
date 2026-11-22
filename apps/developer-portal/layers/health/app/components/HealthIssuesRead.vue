<template>
    <span class="text-xs text-muted">{{ read }}</span>
    <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="xs"
        :loading="reloading"
        aria-label="Re-read the issues from GitHub"
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

const read = computed(() => (fetchedAt ? `read ${relativeTime(fetchedAt)}` : "not read yet"));
</script>
