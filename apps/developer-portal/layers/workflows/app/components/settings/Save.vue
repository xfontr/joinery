<template>
    <div class="flex items-center justify-end gap-3">
        <span v-if="changed" class="text-sm text-muted">Unsaved changes</span>
        <UButton
            label="Discard"
            color="neutral"
            variant="ghost"
            :disabled="!changed"
            @click="emit('discard')"
        />
        <UButton label="Save" :disabled="!changed" :loading="saving" @click="emit('save')" />
    </div>
</template>

<script setup lang="ts">
interface Props {
    changed: boolean;
    saving?: boolean;
}

const { changed, saving = false } = defineProps<Props>();
const emit = defineEmits<{ save: []; discard: [] }>();
</script>
