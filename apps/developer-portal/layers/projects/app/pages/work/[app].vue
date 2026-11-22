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

        <section class="mx-auto grid max-w-6xl gap-10 px-4 pb-16 md:grid-cols-12 md:px-10">
            <p class="font-display text-heading text-highlighted md:col-span-7">{{ work.why }}</p>
            <ContentRenderer
                :value="entry"
                class="flex flex-col gap-4 text-base text-muted md:col-span-4 md:col-start-9"
            />
        </section>

        <section class="bg-muted">
            <dl class="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3 md:px-10">
                <div v-for="row in work.design" :key="row.label" class="flex flex-col gap-2">
                    <dt class="font-mono text-xs text-muted uppercase">{{ row.label }}</dt>
                    <dd class="font-display text-2xl text-highlighted">{{ row.value }}</dd>
                </div>
            </dl>
        </section>

        <section class="mx-auto max-w-6xl px-4 pt-16 md:px-10">
            <h2 class="pb-8 font-display text-section text-highlighted">
                {{ $t("workApp.decisions.title") }}
                <mark>{{ $t("workApp.decisions.titleMark") }}</mark>
            </h2>
            <DecisionQuestions :items="work.decisions" split />
        </section>
    </template>

    <section v-else class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10">
        <h1 class="font-display text-section text-highlighted">
            {{ $t("workApp.missing.title") }}
        </h1>
        <ULink to="/" class="text-primary underline underline-offset-4">
            {{ $t("workApp.missing.back") }}
        </ULink>
    </section>
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

useHead({ title: () => work.value?.name ?? t("workApp.missing.title") });
</script>
