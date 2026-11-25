<template>
    <template v-if="work && entry">
        <PageHero
            :carry="`work-title-${work.slug}`"
            :title="work.title"
            :mark="work.mark"
            :lead="work.line"
        >
            <p v-if="work.inProgress" class="text-base text-primary">
                {{ $t("work.inProgress") }} · {{ work.stage }}
            </p>
            <ULink raw :to="live" class="self-start link">{{ work.live.label }}</ULink>
        </PageHero>

        <UContainer as="section" class="page-grid gap-y-10 border-t border-accented pt-10 pb-24">
            <div class="col-span-4 flex flex-col gap-6 md:col-span-5">
                <p class="text-heading text-highlighted">{{ work.why }}</p>
                <ContentRenderer :value="entry" class="flex flex-col gap-4 text-base" />
            </div>
            <WorkFigure :work class="col-span-4 md:col-span-6 md:col-start-7" />
        </UContainer>

        <WorkflowProjectMaps :project="work.slug" class="mb-24" />

        <UContainer as="dl">
            <div
                v-for="row in work.design"
                :key="row.label"
                class="page-grid items-baseline gap-y-1 border-t border-default py-5 first:border-accented"
            >
                <dt class="col-span-4 font-mono text-meta text-muted md:col-span-3">
                    {{ row.label }}
                </dt>
                <dd class="col-span-4 text-heading text-highlighted md:col-span-9">
                    {{ row.value }}
                </dd>
            </div>
        </UContainer>

        <UContainer as="section" class="pt-32">
            <h2 class="pb-10 text-section text-highlighted">
                {{ $t("workApp.decisions.title") }}
                <mark>{{ $t("workApp.decisions.titleMark") }}</mark>
            </h2>
            <DecisionQuestions :items="work.decisions" class="border-t border-accented" />
        </UContainer>
    </template>

    <UContainer v-else as="section" class="flex flex-col gap-6 pt-10 pb-16">
        <h1 class="text-section text-highlighted">{{ $t("workApp.missing.title") }}</h1>
        <ULink raw to="/" class="self-start link">{{ $t("workApp.missing.back") }}</ULink>
    </UContainer>
</template>

<script setup lang="ts">
import { toWorkCase } from "~/utils/work";

const { t } = useI18n();
const route = useRoute();

const { data: entry } = await useWorkEntry(() => String(route.params.app ?? ""));

const work = computed(() => toWorkCase(entry.value));
const live = computed(() => (work.value ? portalUrl(work.value.live.href) : ""));

if (!work.value) setResponseStatus(404);

useSeoMeta({
    title: () => work.value?.name ?? t("workApp.missing.title"),
    description: () => work.value?.line,
    ogImage: () => work.value && workShareImage(work.value),
    ogImageAlt: () => work.value?.screenshot.alt,
});
</script>
