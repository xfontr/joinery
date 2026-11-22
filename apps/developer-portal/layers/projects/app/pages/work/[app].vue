<template>
    <template v-if="work && entry">
        <PageHero
            :carry="`work-title-${work.slug}`"
            :kicker="$t('workApp.kicker', { kind: work.kind })"
            :title="work.title"
            :mark="work.mark"
            :lead="work.line"
        >
            <p class="font-mono text-sm text-muted">{{ facts }}</p>
        </PageHero>

        <WorkFigure :work />

        <UContainer as="section" class="grid gap-10 pb-16 md:grid-cols-12">
            <p class="font-display text-heading text-highlighted md:col-span-7">{{ work.why }}</p>
            <ContentRenderer
                :value="entry"
                class="flex flex-col gap-4 text-base text-muted md:col-span-4 md:col-start-9"
            />
        </UContainer>

        <section class="bg-muted">
            <UContainer as="dl" class="grid gap-8 py-14 md:grid-cols-3">
                <div v-for="row in work.design" :key="row.label" class="flex flex-col gap-2">
                    <dt class="font-mono text-xs text-muted uppercase">{{ row.label }}</dt>
                    <dd class="font-display text-2xl text-highlighted">{{ row.value }}</dd>
                </div>
            </UContainer>
        </section>

        <UContainer as="section" class="pt-16">
            <h2 class="pb-8 font-display text-section text-highlighted">
                {{ $t("workApp.decisions.title") }}
                <mark>{{ $t("workApp.decisions.titleMark") }}</mark>
            </h2>
            <DecisionQuestions :items="work.decisions" split />
        </UContainer>
    </template>

    <UContainer v-else as="section" class="flex flex-col gap-6 pt-10 pb-16">
        <h1 class="font-display text-section text-highlighted">
            {{ $t("workApp.missing.title") }}
        </h1>
        <ULink to="/" class="text-primary underline underline-offset-4">
            {{ $t("workApp.missing.back") }}
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
import { toWorkCase } from "#layers/projects/app/utils/work.ts";

definePageMeta({ layout: "visitor" });

const { t } = useI18n();
const route = useRoute();

const { data: entry } = await useWorkEntry(() => String(route.params.app ?? ""));

const work = computed(() => toWorkCase(entry.value));
const facts = computed(() =>
    work.value
        ? t("workApp.facts", { facts: work.value.facts.join(" · "), date: work.value.countedOn })
        : "",
);

if (!work.value) setResponseStatus(404);

useSeoMeta({
    title: () => work.value?.name ?? t("workApp.missing.title"),
    description: () => work.value?.line,
});
</script>
