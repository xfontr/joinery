<template>
    <section
        id="opiniones"
        class="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-24 md:px-10 md:py-32"
    >
        <h2 class="text-4xl/tight text-highlighted md:text-6xl">{{ copy.voicesTitle }}</h2>
        <div class="grid gap-16 lg:grid-cols-[3fr_2fr]">
            <figure :lang="first.lang" class="flex flex-col gap-6">
                <blockquote
                    data-display
                    class="text-2xl/snug tracking-tight text-highlighted md:text-4xl"
                >
                    «{{ first.text }}»
                </blockquote>
                <figcaption class="text-base text-muted">{{ first.name }}</figcaption>
            </figure>
            <div class="flex flex-col gap-10">
                <figure
                    v-for="item in others"
                    :key="item.name"
                    :lang="item.lang"
                    class="flex flex-col gap-3 border-t border-default pt-6"
                >
                    <blockquote class="text-lg">«{{ item.text }}»</blockquote>
                    <figcaption class="text-base text-muted">{{ item.name }}</figcaption>
                </figure>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { copy, testimonials } from "../fixtures";

type Testimonial = (typeof testimonials)[number];

interface Props {
    without?: string;
}

const props = defineProps<Props>();

const [first, ...others] = [testimonials[1]!, testimonials[0]!, ...testimonials.slice(2)].filter(
    (item) => item.name !== props.without,
) as [Testimonial, ...Testimonial[]];
</script>
