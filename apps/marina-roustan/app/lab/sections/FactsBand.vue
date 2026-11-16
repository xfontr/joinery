<template>
    <section class="bg-muted">
        <dl
            class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-5 py-16 md:grid-cols-4 md:px-10 md:py-20"
        >
            <div v-for="item in facts" :key="item.label" class="flex flex-col gap-2">
                <dt class="order-2 text-base">{{ item.label }}</dt>
                <dd
                    data-display
                    class="order-1 text-5xl font-semibold tracking-tight text-highlighted"
                >
                    {{ item.figure }}
                </dd>
            </div>
        </dl>
    </section>
</template>

<script setup lang="ts">
import { facts } from "../fixtures";
</script>
