<template>
    <UModal v-model:open="open" :title :description>
        <template #footer>
            <div class="flex w-full justify-end gap-2">
                <UButton
                    :label="$t('workflowLeaveModal.stay')"
                    color="neutral"
                    variant="ghost"
                    @click="open = false"
                />
                <UButton :label="action" color="error" @click="emit('leave')" />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    description: string;
    /** The label on the button that leaves anyway. */
    action: string;
}

const { title, description, action } = defineProps<Props>();
const emit = defineEmits<{ leave: [] }>();
const open = defineModel<boolean>("open", { required: true });
</script>
