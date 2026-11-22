<template>
    <div v-if="index">
        <BasePageIntro :breadcrumbs="[{ label: $t('categories.title') }]">
            <BasePageHeading
                :kicker="$t('categories.kicker')"
                :title="$t('categories.title')"
                :lead="$t('categories.lead')"
            />
            <SubjectsSectionNav :index />
        </BasePageIntro>
        <SubjectsGrid :subjects="index.subjects" />
        <SubjectsFormats :formats="index.formats" />
        <SubjectsTopics :topics="index.topics" />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "categories", path: "/areas/" });

const { t } = useI18n();

const index = await useRequiredFetch<SubjectIndex>("/api/subjects");

useSeoMeta({ title: () => t("categories.title"), description: () => t("categories.lead") });
</script>
