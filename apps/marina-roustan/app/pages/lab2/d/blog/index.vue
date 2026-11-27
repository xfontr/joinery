<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <ConsultaShell page="blog">
        <section class="top">
            <div class="k-wrap">
                <h1>Publicaciones</h1>
                <p class="lead">
                    Artículos sobre terapia, cáncer, familia y ética, algunos publicados en revistas
                    científicas.
                </p>
            </div>
        </section>
        <section class="k-wrap k-block">
            <PostList :items="posts" />
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import PostList from "~/lab2/c/PostList.vue";
import { posts } from "~/lab2/content";

useHead({ title: "D · Publicaciones · Lab 2" });
</script>

<style scoped>
.top {
    background: var(--sun);
    padding-block: 3rem 3.5rem;
}
@media (min-width: 900px) {
    .top {
        padding-block: 4.5rem 5rem;
    }
}
h1 {
    font-size: clamp(2.375rem, 5vw, 3.5rem);
    line-height: 1.08;
}
.lead {
    margin-top: 1rem;
    max-width: 36rem;
    font-size: 1.1875rem;
}
</style>
