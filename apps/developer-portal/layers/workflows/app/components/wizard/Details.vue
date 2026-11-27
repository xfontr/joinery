<template>
    <form class="flex flex-col gap-4" @submit.prevent="emit('submit')">
        <UFormField :label="$t('wizardDetails.title.label')" required>
            <UInput
                v-model="title"
                :placeholder="$t('wizardDetails.title.placeholder')"
                size="lg"
                class="w-full"
                autofocus
            />
        </UFormField>
        <UFormField
            :label="$t('wizardDetails.summary.label')"
            :help="$t('wizardDetails.summary.help')"
        >
            <UInput v-model="summary" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-3">
            <UFormField
                :label="$t('wizardDetails.id.label')"
                :help="$t('wizardDetails.id.help')"
                :error="idError"
            >
                <UInput v-model="id" class="w-full" />
            </UFormField>
            <UFormField
                :label="$t('wizardDetails.milestone.label')"
                :help="$t('wizardDetails.milestone.help')"
                :error="milestoneError"
            >
                <UInput v-model="milestone" class="w-full" />
            </UFormField>
            <UFormField
                :label="$t('wizardDetails.area.label')"
                :help="$t('wizardDetails.area.help')"
            >
                <UInput v-model="area" class="w-full" />
            </UFormField>
        </div>
        <button type="submit" hidden />
    </form>
</template>

<script setup lang="ts">
interface Props {
    idError?: string;
    milestoneError?: string;
}

const { idError, milestoneError } = defineProps<Props>();
const emit = defineEmits<{ submit: [] }>();

const title = defineModel<string>("title", { required: true });
const summary = defineModel<string>("summary", { required: true });
const id = defineModel<string>("id", { required: true });
const milestone = defineModel<string>("milestone", { required: true });
const area = defineModel<string>("area", { required: true });
</script>
