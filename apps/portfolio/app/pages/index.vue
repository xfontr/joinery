<template>
    <UContainer
        ref="hero"
        as="section"
        class="flex flex-col justify-between gap-12 overflow-x-clip pt-8 pb-10 md:min-h-hero md:gap-16 md:pt-16"
    >
        <HeroStatement :title="$t('index.title')" :mark="$t('index.titleMark')" />
        <div class="page-grid items-end gap-y-10">
            <p class="col-span-4 text-lead text-highlighted md:col-span-6">
                {{ $t("index.lead") }}
            </p>
            <ul class="col-span-4 md:col-span-5 md:col-start-8">
                <li v-for="item in index" :key="item.slug" class="border-t border-default">
                    <ULink :to="item.to" class="group grid grid-cols-2 gap-4 py-2.5">
                        <span class="font-medium text-highlighted group-hover:text-primary">
                            {{ item.name }}
                        </span>
                        <span class="self-center font-mono text-meta text-muted">{{
                            item.stage
                        }}</span>
                    </ULink>
                </li>
            </ul>
        </div>
    </UContainer>

    <RuleSheet />

    <WorkflowTeaser />

    <WorkList />
</template>

<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: t("index.head"), description: t("index.lead") });

const { data: work } = await useWorkList();

/** Every piece of work and where it stands, so the first screen already shows what got made. */
const index = computed(() =>
    work.value.map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        stage: entry.stage,
        to: entry.caseStudy ? `/work/${entry.slug}` : portalUrl(entry.live.href),
    })),
);

const hero = useTemplateRef<{ $el: HTMLElement }>("hero");

/** As the first screen scrolls away, the statement's two lines part. */
useMotion(
    computed(() => hero.value?.$el ?? null),
    "scroll",
    ({ gsap, scope }) => {
        const [first, second] = gsap.utils.toArray<HTMLElement>("[data-line]", scope);
        const drift = { trigger: scope, start: "top top", end: "bottom top", scrub: 0.6 };

        gsap.to(first ?? [], { x: "-5vw", ease: "none", scrollTrigger: drift });
        gsap.to(second ?? [], { x: "7vw", ease: "none", scrollTrigger: drift });
    },
);
</script>
