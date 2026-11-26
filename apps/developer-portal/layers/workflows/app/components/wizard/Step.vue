<template>
    <header>
        <h2 class="text-lg font-semibold">{{ step.question }}</h2>
        <p class="text-sm text-muted">{{ step.hint }}</p>
    </header>

    <WorkflowTemplatePicker
        v-if="step.id === 'template'"
        :templates
        :model-value="templateId"
        @update:model-value="emit('pickTemplate', $event)"
    />
    <WizardDetails
        v-else-if="step.id === 'details'"
        v-model:title="title"
        v-model:summary="summary"
        v-model:id="id"
        v-model:milestone="milestone"
        v-model:area="area"
        :id-error
        :milestone-error
        @submit="emit('submit')"
    />
    <WorkflowFeaturePicker
        v-else-if="step.id === 'features' && template"
        :features
        editable
        @toggle="(feature, on) => emit('toggle', feature, on)"
    />
    <WorkflowPagePicker
        v-else-if="step.id === 'pages' && template"
        v-model="pages"
        :template
        :errors="pageErrors"
    />
    <WizardReview v-else :rows="review" :preview />
</template>

<script setup lang="ts">
import type {
    Feature,
    ProjectView,
    ReviewRow,
    Template,
} from "#layers/workflows/shared/workflows.ts";

interface Props {
    step: { id: string; question: string; hint: string };
    templates: Template[];
    templateId: string;
    template: Template | undefined;
    idError?: string;
    milestoneError?: string;
    features: Feature[];
    pageErrors: (string | null)[];
    review: ReviewRow[];
    preview: ProjectView | null;
}

const {
    step,
    templates,
    templateId,
    template,
    idError,
    milestoneError,
    features,
    pageErrors,
    review,
    preview,
} = defineProps<Props>();
const emit = defineEmits<{
    pickTemplate: [template: string];
    toggle: [feature: string, on: boolean];
    submit: [];
}>();

const title = defineModel<string>("title", { required: true });
const summary = defineModel<string>("summary", { required: true });
const id = defineModel<string>("id", { required: true });
const milestone = defineModel<string>("milestone", { required: true });
const area = defineModel<string>("area", { required: true });
const pages = defineModel<{ key: number; type: string; title: string }[]>("pages", {
    required: true,
});
</script>
