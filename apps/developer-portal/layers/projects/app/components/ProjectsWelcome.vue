<template>
    <section class="flex flex-col gap-3">
        <div class="max-w-3xl">
            <h1 class="text-2xl font-semibold">{{ readme?.title ?? "Monorepo" }}</h1>
            <p class="mt-1 text-sm text-muted">
                {{ readme?.description ?? "The repository summary is not available yet." }}
            </p>
        </div>

        <div class="grid gap-3 @2xl:grid-cols-3">
            <NuxtLink
                v-for="route in ROUTES"
                :key="route.to"
                :to="route.to"
                class="border border-default bg-default p-4 hover:bg-elevated"
            >
                <UIcon :name="route.icon" class="size-5 text-muted" />
                <h2 class="mt-3 font-semibold">{{ route.title }}</h2>
                <p class="mt-1 text-sm text-muted">{{ route.line }}</p>
            </NuxtLink>
        </div>
    </section>
</template>

<script setup lang="ts">
const ROUTES = [
    {
        to: "/projects",
        icon: "i-lucide-boxes",
        title: "Explore what exists",
        line: "Browse the applications, building blocks, and tooling.",
    },
    {
        to: "/graph",
        icon: "i-lucide-git-fork",
        title: "Understand how it works",
        line: "See how projects fit together and share responsibilities.",
    },
    {
        to: "/wiki/docs/guides/first-hour",
        icon: "i-lucide-play",
        title: "Run or contribute",
        line: "Get a working checkout and find your first useful step.",
    },
];

const { data: readme } = await useAsyncData("repository-readme", () =>
    queryCollection("docs").path("/readme").select("title", "description").first(),
);
</script>
