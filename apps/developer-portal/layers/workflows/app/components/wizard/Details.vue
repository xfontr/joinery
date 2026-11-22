<template>
    <form class="flex flex-col gap-4" @submit.prevent="emit('submit')">
        <UFormField label="Title" required>
            <UInput
                v-model="title"
                placeholder="Harbour Notes"
                size="lg"
                class="w-full"
                autofocus
            />
        </UFormField>
        <UFormField label="Summary" help="One line on what the site is and who reads it">
            <UTextarea v-model="summary" :rows="2" class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-3">
            <UFormField label="Id" help="kebab-case; the file name" :error="idError">
                <UInput v-model="id" class="w-full" />
            </UFormField>
            <UFormField label="Milestone" help="Its tickets live here" :error="milestoneError">
                <UInput v-model="milestone" class="w-full" />
            </UFormField>
            <UFormField label="Area label" help="Where its code lives">
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
