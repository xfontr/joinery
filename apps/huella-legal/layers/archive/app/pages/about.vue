<template>
    <div>
        <AboutIntro :articles="articleCount" :authors="authors.length" />
        <AboutQuote />
        <AboutValues />
        <AboutTopics />
        <AboutTeam />
        <AboutModel />
        <AboutCallToAction />
        <NewsletterBand />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ name: "about", path: "/sobre/" });

const { t } = useI18n();

useSeoMeta({
    title: () => t("about.title"),
    description: () => t("about.description"),
    ogType: "website",
});

const [subjectIndex, authors] = await Promise.all([
    useRequiredFetch<SubjectIndex>("/api/subjects"),
    useRequiredFetch<Facet<Author>[]>("/api/authors", () => []),
]);

const articleCount = computed<number>(
    () => subjectIndex.value?.formats.reduce((total, { count }) => total + count, 0) ?? 0,
);
</script>

<style>
@supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
        .hl-about-reveal {
            animation: hl-about-rise linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 80%;
        }
    }
}

@keyframes hl-about-rise {
    from {
        opacity: 0;
        translate: 0 calc(1.5rem + var(--step, 0) * 1rem);
    }
}
</style>
