<!-- eslint-disable better-tailwindcss/no-unknown-classes, vue/no-v-html -- throwaway lab -->
<template>
    <ConsultaShell page="blog">
        <article v-if="post" :lang="post.lang" class="k-wrap post">
            <NuxtLink to="/lab2/d/blog" class="more back"
                ><span aria-hidden="true">←</span> Publicaciones</NuxtLink
            >
            <h1>{{ post.title }}</h1>
            <p class="meta">
                <time :datetime="post.date">{{ date }}</time> · Marina Roustan
            </p>
            <img v-if="post.image" :src="post.image" alt="" class="cover" />
            <div v-if="post.body" class="prose" v-html="post.body" />
            <div v-else class="prose">
                <p>{{ post.excerpt }}</p>
                <p class="pending">
                    (Lab: el texto completo de este artículo aún no está copiado.)
                </p>
            </div>
        </article>

        <section class="sand">
            <div class="k-wrap k-block">
                <h2 class="k-h2">Más publicaciones</h2>
                <PostList :items="more" />
            </div>
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes, vue/no-v-html -->

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import PostList from "~/lab2/c/PostList.vue";
import { formatDate, posts } from "~/lab2/content";

const route = useRoute();
const post = computed(() => posts.find((item) => item.slug === route.params.slug));
const date = computed(() => (post.value ? formatDate(post.value.date) : ""));
const more = computed(() => posts.filter((item) => item !== post.value).slice(0, 3));

useHead({ title: () => `${post.value?.title ?? "Publicaciones"} · D · Lab 2` });
</script>

<style scoped>
.post {
    max-width: calc(44rem + 5rem);
    padding-block: 3rem 5rem;
}
.back {
    margin-bottom: 1.5rem;
}
h1 {
    font-size: clamp(2rem, 4.5vw, 3rem);
    line-height: 1.12;
}
.meta {
    margin-top: 1rem;
    color: var(--muted);
    font-size: 1rem;
}
.cover {
    display: block;
    width: 100%;
    height: auto;
    margin-top: 2rem;
    border-radius: 12px;
}
.prose {
    margin-top: 2rem;
}
.prose :deep(* + *) {
    margin-top: 1em;
}
.prose :deep(h2),
.prose :deep(h3) {
    font-family: "Young Serif", Georgia, serif;
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 1.25;
    margin-top: 2em;
}
.prose :deep(ol),
.prose :deep(ul) {
    padding-left: 1.5rem;
    list-style: revert;
}
.prose :deep(li + li) {
    margin-top: 0.4em;
}
.pending {
    color: var(--muted);
    font-style: italic;
}
</style>
