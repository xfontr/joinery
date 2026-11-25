<template>
    <UContainer as="section" id="work" class="pt-32">
        <h2 class="pb-10 text-section text-highlighted">
            {{ $t("workList.title") }} <mark>{{ $t("workList.titleMark") }}</mark>
        </h2>
        <ul data-dim-rows class="border-t border-accented">
            <li
                v-for="item in items"
                :key="item.slug"
                ref="rows"
                :data-slug="item.slug"
                :data-lit="(scrolled && lit === item.slug) || undefined"
                class="page-grid items-start gap-y-4 border-t border-default py-7 first:border-t-0"
            >
                <ULink :to="item.story ?? item.href" class="group col-span-4 md:col-span-3">
                    <h3
                        class="text-heading text-highlighted group-hover:text-primary"
                        :style="carried(`work-title-${item.slug}`)"
                    >
                        {{ item.name }}
                    </h3>
                    <p v-if="item.inProgress" class="mt-1 text-base text-primary">
                        {{ $t("work.inProgress") }}
                    </p>
                </ULink>
                <div class="col-span-4 flex flex-col gap-2 md:col-span-5">
                    <p class="text-base">{{ item.what }}</p>
                    <p class="flex flex-wrap gap-x-6 gap-y-1 pt-2 text-base">
                        <ULink v-if="item.story" :to="item.story" raw class="link">
                            {{ $t("workList.caseStudy") }}
                        </ULink>
                        <ULink :to="item.href" raw class="link">{{ item.cta }}</ULink>
                    </p>
                </div>
                <ULink
                    v-if="item.shot"
                    :to="item.story ?? item.href"
                    class="col-span-4 md:col-span-3 md:col-start-10"
                >
                    <img
                        v-bind="item.shot"
                        sizes="(min-width: 48rem) 25vw, 100vw"
                        loading="lazy"
                        :alt="item.shotAlt"
                        :style="carried(`work-shot-${item.slug}`)"
                        width="1440"
                        height="900"
                        class="shot"
                    />
                </ULink>
            </li>
        </ul>
    </UContainer>
</template>

<script setup lang="ts">
import { useEventListener, useIntersectionObserver } from "@vueuse/core";

const { data: work } = await useWorkList();

const items = computed(() =>
    work.value.map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        inProgress: entry.inProgress,
        what: entry.line,
        story: entry.caseStudy ? `/work/${entry.slug}` : null,
        cta: entry.live.label,
        href: portalUrl(entry.live.href),
        shot: workScreenshot(entry),
        shotAlt: entry.screenshot?.alt ?? "",
    })),
);

const rows = useTemplateRef<HTMLElement[]>("rows");
/** The row crossing the middle of the screen, which stays lit while the rest dim. */
const lit = ref<string | null>(null);
/** Scrolling is what lights a row, so a page that loads with the list mid-screen stays undimmed. */
const scrolled = ref(false);

useEventListener("scroll", () => (scrolled.value = true), { passive: true, once: true });

useIntersectionObserver(
    computed(() => rows.value ?? []),
    (entries) => {
        for (const entry of entries) {
            const slug = (entry.target as HTMLElement).dataset.slug ?? null;
            if (entry.isIntersecting) lit.value = slug;
            else if (lit.value === slug) lit.value = null;
        }
    },
    { rootMargin: "-48% 0px -48% 0px" },
);
</script>
