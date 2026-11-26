<template>
    <div class="flex flex-col justify-between md:min-h-hero">
        <PageHero
            carry="hero-workflows"
            :title="$t('agenticWorkflows.title')"
            :mark="$t('agenticWorkflows.titleMark')"
            :lead="$t('agenticWorkflows.lead')"
        />

        <UContainer>
            <ol class="sheet border-t border-accented">
                <li
                    v-for="(step, index) in STEPS"
                    :key="step"
                    class="flex flex-col gap-4 border-t border-default pt-5 pb-8 md:border-t-0 md:px-5 md:first:pl-0"
                >
                    <span class="font-mono text-meta text-muted">0{{ index + 1 }}</span>
                    <span class="text-heading text-highlighted">
                        {{ $t(`agenticWorkflows.steps.${step}.title`) }}
                    </span>
                    <span class="text-base">{{ $t(`agenticWorkflows.steps.${step}.body`) }}</span>
                </li>
            </ol>
        </UContainer>
    </div>

    <WorkflowProjectMaps />

    <UContainer v-if="templates.length" as="section" class="pt-32">
        <div class="page-grid items-end gap-y-6 pb-10">
            <h2 class="col-span-4 text-section text-highlighted md:col-span-6">
                {{ $t("agenticWorkflows.templates.title") }}
                <mark>{{ $t("agenticWorkflows.templates.titleMark") }}</mark>
            </h2>
            <p class="col-span-4 text-base md:col-span-4 md:col-start-9">
                {{ $t("agenticWorkflows.templates.line") }}
            </p>
        </div>
        <TermList :items="templates" grid class="border-t border-accented" />
        <ULink raw :to="WORKFLOWS" class="mt-8 inline-block link">
            {{ $t("agenticWorkflows.templates.all") }} ↗
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
const STEPS = ["template", "unblocked", "file", "agents", "lessons"] as const;

const WORKFLOWS = portalUrl("/workflows");

const { t, te } = useI18n();
const { data } = await useWorkflowTemplates();

const templates = computed(() =>
    data.value.templates.map(({ id, title, summary }) => {
        const key = `agenticWorkflows.templates.items.${id}`;
        return { id, term: title, detail: te(key) ? t(key) : summary };
    }),
);

useSeoMeta({ title: t("agenticWorkflows.head"), description: t("agenticWorkflows.lead") });
</script>
