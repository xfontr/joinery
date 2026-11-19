<template>
    <template v-if="work">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
            <p class="font-mono text-xs text-muted uppercase">A case · {{ work.kind }}</p>
            <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
                {{ work.title }} <mark>{{ work.mark }}</mark>
            </h1>
            <p class="max-w-2xl text-2xl text-highlighted">{{ work.line }}</p>
            <p class="font-mono text-sm text-muted">
                {{ factsLine }}
            </p>
        </section>

        <figure class="mx-auto max-w-6xl px-4 pb-16 md:px-10">
            <img
                :src="screenshot"
                :alt="work.screenshot.alt"
                width="1440"
                height="900"
                class="w-full border border-default"
            />
            <figcaption
                class="mt-3 flex flex-col gap-1 text-sm text-muted md:flex-row md:justify-between"
            >
                <span>{{ work.screenshot.caption }}</span>
                <ULink :to="work.live.href" class="text-primary underline underline-offset-4">
                    {{ work.live.label }}
                </ULink>
            </figcaption>
        </figure>

        <section class="mx-auto grid max-w-6xl gap-10 px-4 pb-16 md:grid-cols-12 md:px-10">
            <p class="font-display text-heading text-highlighted md:col-span-7">{{ work.why }}</p>
            <div class="flex flex-col gap-4 text-base text-muted md:col-span-4 md:col-start-9">
                <p v-for="paragraph in work.story" :key="paragraph">{{ paragraph }}</p>
            </div>
        </section>

        <section class="bg-muted">
            <dl class="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3 md:px-10">
                <div v-for="row in work.design" :key="row.label" class="flex flex-col gap-2">
                    <dt class="font-mono text-xs text-muted uppercase">{{ row.label }}</dt>
                    <dd class="font-display text-2xl text-highlighted">{{ row.value }}</dd>
                </div>
            </dl>
        </section>

        <section class="mx-auto max-w-6xl px-4 pt-16 md:px-10">
            <h2 class="pb-8 font-display text-section text-highlighted">
                Decided <mark>before</mark> building
            </h2>
            <ul class="flex flex-col">
                <li v-for="decision in work.decisions" :key="decision.id">
                    <ULink
                        :to="`/decisions/${decision.id}`"
                        class="group grid gap-2 border-t border-default py-6 md:grid-cols-12"
                    >
                        <span
                            class="font-display text-2xl text-highlighted group-hover:text-primary md:col-span-6"
                        >
                            {{ decision.question }}
                        </span>
                        <span class="text-base text-muted md:col-span-6">
                            {{ decision.answer }}
                        </span>
                    </ULink>
                </li>
            </ul>
        </section>
    </template>

    <section v-else class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10">
        <h1 class="font-display text-section text-highlighted">No such work</h1>
        <ULink to="/" class="text-primary underline underline-offset-4"
            >Back to the front page</ULink
        >
    </section>
</template>

<script setup lang="ts">
import { workFor } from "#layers/projects/shared/work.ts";

definePageMeta({ layout: "visitor" });

const SCREENSHOTS = import.meta.glob<string>("../../assets/work/*.jpg", {
    eager: true,
    import: "default",
});

const route = useRoute();

const work = computed(() => workFor(String(route.params.app ?? "")));
const screenshot = computed(() =>
    work.value ? SCREENSHOTS[`../../assets/work/${work.value.screenshot.file}`] : undefined,
);
const factsLine = computed(() =>
    work.value ? `${work.value.facts.join(" · ")}, counted on ${work.value.countedOn}` : "",
);

if (!work.value) setResponseStatus(404);

useHead({ title: () => work.value?.name ?? "No such work" });
</script>
