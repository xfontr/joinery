<template>
    <div>
        <BasePageIntro :breadcrumbs="[{ label: $t('authors.title') }]">
            <DirectoryIntro :count="authors.length" />
        </BasePageIntro>
        <DirectoryPrinciples />
        <DirectoryListing :authors />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "authors", path: "/colaboradores/" });

const { t } = useI18n();

const authors = await useRequiredFetch<Facet<Author>[]>("/api/authors", () => []);

useSeoMeta({
    title: () => t("authors.title"),
    description: () => t("directoryIntro.title"),
});
</script>
