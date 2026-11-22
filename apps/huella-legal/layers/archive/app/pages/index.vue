<template>
    <div v-if="home">
        <HomeHero />
        <HomeFeatured v-if="home.lead" :lead="home.lead" :latest="home.latest" />
        <HomeRecent :articles="home.recent" />
        <LazyHomeSubjects hydrate-on-visible :subjects="home.subjects" :formats="home.formats" />
        <LazyHomeTheses hydrate-on-visible :articles="home.theses" />
        <HomePublishPrompt />
        <LazyNewsletterBand hydrate-on-visible />
    </div>
</template>

<script setup lang="ts">
const home = await useRequiredFetch<Home>("/api/home");

useHead({ titleTemplate: "%s" });
</script>
