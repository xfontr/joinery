<template>
    <SettingsSection :title="$t('settingsGeneral.title')" :hint="$t('settingsGeneral.hint')">
        <div class="flex flex-col gap-4 rounded-xl border border-default p-4">
            <UFormField :label="$t('settingsGeneral.titleField')">
                <UInput v-model="title" :disabled="!editable" class="w-full" />
            </UFormField>
            <UFormField :label="$t('settingsGeneral.summary')">
                <UTextarea v-model="summary" :rows="2" :disabled="!editable" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
                <UFormField
                    :label="$t('settingsGeneral.milestone.label')"
                    :help="$t('settingsGeneral.milestone.help')"
                >
                    <UInput v-model="milestone" :disabled="!editable" class="w-full" />
                </UFormField>
                <UFormField :label="$t('settingsGeneral.area')">
                    <UInput v-model="area" :disabled="!editable" class="w-full" />
                </UFormField>
            </div>
            <p class="text-xs text-muted">{{ $t("settingsGeneral.template", { template }) }}</p>
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
