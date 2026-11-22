<template>
    <PageHero
        carry="hero-workflows"
        :title="$t('agenticWorkflows.title')"
        :mark="$t('agenticWorkflows.titleMark')"
        :lead="$t('agenticWorkflows.lead')"
    />

    <section class="mx-auto max-w-6xl px-4 pb-20 md:px-10">
        <ol class="grid gap-10 border-t border-accented pt-10 md:grid-cols-5">
            <li v-for="(step, index) in STEPS" :key="step" class="flex flex-col gap-3">
                <span class="font-display text-section text-primary">{{ index + 1 }}</span>
                <span class="font-display text-2xl text-highlighted">
                    {{ $t(`agenticWorkflows.steps.${step}.title`) }}
                </span>
                <span class="text-base">{{ $t(`agenticWorkflows.steps.${step}.body`) }}</span>
            </li>
        </ol>
    </section>

    <WorkflowProjectMaps />

    <section class="mx-auto max-w-6xl px-4 pt-20 md:px-10">
        <div class="grid gap-6 md:grid-cols-12">
            <h2 class="font-display text-section text-highlighted md:col-span-5">
                {{ $t("agenticWorkflows.lessons.title") }}
                <mark>{{ $t("agenticWorkflows.lessons.titleMark") }}</mark>
            </h2>
            <p class="self-end text-base md:col-span-6 md:col-start-7">
                {{ $t("agenticWorkflows.lessons.line") }}
            </p>
        </div>
        <ul class="mt-10 flex flex-col">
            <li
                v-for="lesson in LESSONS"
                :key="lesson"
                class="grid gap-2 border-t border-default py-6 md:grid-cols-12"
            >
                <span class="font-display text-2xl text-highlighted md:col-span-5">
                    {{ $t(`agenticWorkflows.lessons.items.${lesson}.rule`) }}
                </span>
                <span class="text-base text-muted md:col-span-7">
                    {{ $t(`agenticWorkflows.lessons.items.${lesson}.paid`) }}
                </span>
            </li>
        </ul>
        <ULink to="/workflows" class="mt-6 inline-block text-primary underline underline-offset-4">
            {{ $t("agenticWorkflows.lessons.all") }} →
        </ULink>
    </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "visitor" });

const STEPS = ["template", "unblocked", "file", "agents", "lessons"] as const;
const LESSONS = [
    "answerFirst",
    "unknownsFirst",
    "hostDecision",
    "realDeploy",
    "blockedTicket",
] as const;

const { t } = useI18n();

useHead({ title: t("agenticWorkflows.head") });
</script>
