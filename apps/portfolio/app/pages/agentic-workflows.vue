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

    <UContainer as="section" class="pt-32">
        <div class="page-grid items-end gap-y-6 pb-10">
            <h2 class="col-span-4 text-section text-highlighted md:col-span-6">
                {{ $t("agenticWorkflows.lessons.title") }}
                <mark>{{ $t("agenticWorkflows.lessons.titleMark") }}</mark>
            </h2>
            <p class="col-span-4 text-base md:col-span-4 md:col-start-9">
                {{ $t("agenticWorkflows.lessons.line") }}
            </p>
        </div>
        <ul class="border-t border-accented">
            <li
                v-for="lesson in LESSONS"
                :key="lesson"
                class="page-grid gap-y-2 border-t border-default py-6 first:border-t-0"
            >
                <span class="col-span-4 text-heading text-highlighted md:col-span-5">
                    {{ $t(`agenticWorkflows.lessons.items.${lesson}.rule`) }}
                </span>
                <span class="col-span-4 text-base md:col-span-6 md:col-start-7">
                    {{ $t(`agenticWorkflows.lessons.items.${lesson}.paid`) }}
                </span>
            </li>
        </ul>
        <ULink raw :to="WORKFLOWS" class="mt-8 inline-block link">
            {{ $t("agenticWorkflows.lessons.all") }} ↗
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
const STEPS = ["template", "unblocked", "file", "agents", "lessons"] as const;
const LESSONS = [
    "answerFirst",
    "unknownsFirst",
    "hostDecision",
    "realDeploy",
    "blockedTicket",
] as const;

const WORKFLOWS = portalUrl("/workflows");

const { t } = useI18n();

useSeoMeta({ title: t("agenticWorkflows.head"), description: t("agenticWorkflows.lead") });
</script>
