<template>
    <section
        id="publicaciones"
        class="mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-24 md:px-10 md:pb-32"
    >
        <h2 class="text-4xl/tight text-highlighted md:text-6xl">{{ copy.writingTitle }}</h2>
        <ul>
            <li
                v-for="post in recent"
                :key="post.slug"
                :lang="post.lang"
                class="border-t border-default last:border-b"
            >
                <span class="grid gap-1 py-5 md:grid-cols-[6rem_1fr]">
                    <span class="text-base text-muted">{{ year(post.date) }}</span>
                    <span class="text-xl text-highlighted">{{ post.title }}</span>
                </span>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { copy, posts, year } from "../fixtures";

const recent = posts.slice(0, 5);
</script>
