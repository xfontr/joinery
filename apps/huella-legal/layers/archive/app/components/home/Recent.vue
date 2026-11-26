<template>
    <UContainer as="section" :aria-labelledby="titleId" class="pb-16 lg:pb-20">
        <BaseSectionHeading
            :id="titleId"
            :title="$t('homeRecent.title')"
            :action="{ label: $t('homeRecent.all'), to: { name: 'publications' } }"
        />
        <LazySummaryGrid hydrate-on-visible :articles hide-orphan class="mt-8" />
    </UContainer>
</template>

<script setup lang="ts">
interface Props {
    articles: ArticleSummary[];
}

defineProps<Props>();

const titleId = useId();
</script>
