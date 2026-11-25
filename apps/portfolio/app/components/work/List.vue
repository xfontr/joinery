<template>
    <UContainer as="section" id="work" class="pt-32">
        <h2 class="pb-10 text-section text-highlighted">
            {{ $t("workList.title") }} <mark>{{ $t("workList.titleMark") }}</mark>
        </h2>
        <ul class="border-t border-accented">
            <li
                v-for="item in items"
                :key="item.slug"
                class="page-grid items-start gap-y-4 border-t border-default py-7 first:border-t-0"
            >
                <ULink :to="item.story ?? item.href" class="group col-span-4 md:col-span-3">
                    <h3
                        class="text-heading text-highlighted group-hover:text-primary"
                        :style="carried(`work-title-${item.slug}`)"
                    >
                        {{ item.name }}
                    </h3>
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
                    v-if="item.shot && item.story"
                    :to="item.story"
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
import { isStudy } from "~/utils/work";

const { data: work } = await useWorkList();

const items = computed(() =>
    work.value.map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        what: entry.line,
        story: entry.caseStudy ? `/work/${entry.slug}` : null,
        cta: entry.live.label,
        href: portalUrl(entry.live.href),
        shot: isStudy(entry) ? workScreenshot(entry) : undefined,
        shotAlt: isStudy(entry) ? entry.screenshot.alt : "",
    })),
);
</script>
