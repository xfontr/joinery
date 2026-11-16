<template>
    <section data-dark>
        <div
            class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1fr_1.5fr] md:px-10 md:py-32"
        >
            <img
                :src="book.image"
                alt="Portada del libro"
                width="500"
                height="800"
                class="mx-auto w-48 shadow-2xl md:w-64"
            />
            <div class="flex flex-col gap-6">
                <p class="text-base">Libro de la Dra. Roustan</p>
                <h2 class="text-4xl/tight text-highlighted md:text-6xl">
                    {{ book.title }}
                </h2>
                <p class="max-w-xl text-lg md:text-xl">{{ book.body }}</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { book } from "../fixtures";
</script>
