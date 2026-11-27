<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <ul class="posts">
        <li v-for="post in items" :key="post.slug" :lang="post.lang">
            <NuxtLink :to="`${base}/blog/${post.slug}`" class="card">
                <span class="thumb">
                    <img v-if="post.image" :src="post.image" alt="" loading="lazy" />
                </span>
                <span class="meta">
                    <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                    <span v-if="post.lang === 'en'"> · En inglés</span>
                </span>
                <span class="title">{{ post.title }}</span>
                <span class="excerpt">{{ post.excerpt }}</span>
            </NuxtLink>
        </li>
    </ul>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import { formatDate, type posts, useLabBase } from "../content";

interface Props {
    items: typeof posts;
}

defineProps<Props>();

const base = useLabBase();
</script>

<style scoped>
.posts {
    display: grid;
    gap: 2.5rem 2.5rem;
}
@media (min-width: 700px) {
    .posts {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (min-width: 1000px) {
    .posts {
        grid-template-columns: repeat(3, 1fr);
    }
}
.consulta .card {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-decoration: none;
}
.thumb {
    display: block;
    aspect-ratio: 3 / 2;
    margin-bottom: 0.6rem;
    border-radius: 12px;
    overflow: hidden;
    background: var(--sand);
}
.thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.meta {
    font-size: 0.9375rem;
    color: var(--muted);
}
.title {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.375rem;
    line-height: 1.25;
}
.card:hover .title {
    text-decoration: underline;
    text-underline-offset: 0.2em;
}
.excerpt {
    color: var(--muted);
    font-size: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
