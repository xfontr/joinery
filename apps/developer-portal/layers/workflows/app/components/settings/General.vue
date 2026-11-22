<template>
    <SettingsSection title="General" hint="What the project is called and where its tickets live.">
        <div class="flex flex-col gap-4 rounded-xl border border-default p-4">
            <UFormField label="Title">
                <UInput v-model="title" :disabled="!editable" class="w-full" />
            </UFormField>
            <UFormField label="Summary">
                <UTextarea v-model="summary" :rows="2" :disabled="!editable" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
                <UFormField
                    label="Milestone"
                    help="Rename it on GitHub too, or its tickets drop out of view"
                >
                    <UInput v-model="milestone" :disabled="!editable" class="w-full" />
                </UFormField>
                <UFormField label="Area label">
                    <UInput v-model="area" :disabled="!editable" class="w-full" />
                </UFormField>
            </div>
            <p class="text-xs text-muted">
                Template: {{ template }}. It can't change, since the switches and settled blocks
                belong to it.
            </p>
        </div>
    </SettingsSection>
</template>

<script setup lang="ts">
interface Props {
    /** The template's title. */
    template: string;
    editable: boolean;
}

const { template, editable } = defineProps<Props>();

const title = defineModel<string>("title", { required: true });
const summary = defineModel<string>("summary", { required: true });
const milestone = defineModel<string>("milestone", { required: true });
const area = defineModel<string>("area", { required: true });
</script>
