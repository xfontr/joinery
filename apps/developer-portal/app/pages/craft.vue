<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-16 md:px-10 md:pt-20">
        <p class="font-mono text-xs text-muted uppercase">Rule 5, in practice</p>
        <h1 class="font-display text-title text-highlighted md:text-statement">
            Careful, <mark>and measured.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Care that depends on someone remembering slips. Here it's checked by machines on every
            change, so it can't quietly go.
        </p>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-8 md:px-10">
        <article
            v-for="(item, index) in items"
            :key="item.area"
            class="grid gap-4 border-t border-accented py-10 md:grid-cols-12"
        >
            <p class="flex items-baseline gap-3 md:col-span-3 md:flex-col md:gap-2">
                <span class="font-display text-section text-primary">{{ index + 1 }}</span>
                <span class="font-mono text-xs text-muted uppercase">{{ item.area }}</span>
            </p>
            <div class="flex flex-col gap-3 md:col-span-6">
                <h2 class="font-display text-heading text-highlighted">{{ item.claim }}</h2>
                <p class="max-w-xl text-lg">{{ item.how }}</p>
            </div>
            <ULink :to="item.to" class="self-end md:col-span-3">
                <span
                    class="text-base text-highlighted underline decoration-primary underline-offset-4"
                >
                    {{ item.cta }} →
                </span>
            </ULink>
        </article>
    </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "visitor" });
useHead({ title: "The craft" });

const IN_HOUSE = "monorepo/";

const [{ data: metrics }, { data: usage }] = await Promise.all([
    useSnapshot("metrics"),
    useSnapshot("usage"),
]);

const specs = computed(() => {
    const projects = metrics.value?.metrics?.projects;
    return projects?.length ? projects.reduce((sum, project) => sum + project.specs, 0) : null;
});

const rules = computed(() => {
    const all = usage.value?.usage?.lint.rules;
    if (!all) return null;
    const enabled = Object.entries(all).filter(([, rule]) => rule.enabled);
    return enabled.length
        ? {
              enabled: enabled.length,
              inHouse: enabled.filter(([name]) => name.startsWith(IN_HOUSE)).length,
          }
        : null;
});

const items = computed(() => [
    {
        area: "Speed",
        claim: "Huella Legal is prerendered, so a page arrives ready to read.",
        how: "The plan checks real readers' load times, not only a lab score.",
        cta: "Try it on a phone",
        to: "https://staging.huellalegal.com",
    },
    {
        area: "Accessibility",
        claim: "Every page of Huella Legal is tested against WCAG AA.",
        how: "A browser opens each page in the test suite, and a single violation fails the build.",
        cta: "The test approach",
        to: "/decisions/0037-huella-legal-e2e-and-visual-tooling",
    },
    {
        area: "Tests",
        claim: specs.value
            ? `${specs.value} test files, from one function to a whole page driven in a real browser.`
            : "Tests from one function to a whole page driven in a real browser.",
        how: "Coverage is measured on every run, and its floor is enforced in CI.",
        cta: "Coverage, project by project",
        to: "/coverage",
    },
    {
        area: "Rules in code",
        claim: rules.value
            ? `${rules.value.enabled} lint rules switched on, ${rules.value.inHouse} of them written in-house.`
            : "Lint rules decide what lands, some of them written in-house.",
        how: "Switching a rule off needs a written reason, and every rule an agent trips is logged.",
        cta: "Which rules fire",
        to: "/telemetry",
    },
    {
        area: "Repository discipline",
        claim: "One gate checks every commit, push, agent edit and CI run.",
        how: "No build steps in shared packages, no hand-edited versions, no forgotten TODOs: a broken rule can't land.",
        cta: "The gate",
        to: "/wiki/infrastructure/scripts/src/invariants/readme",
    },
    {
        area: "System design",
        claim: "Every app is split into layers that may only lean on the ones beneath.",
        how: "The boundaries are lint rules, so a shortcut across them fails before review.",
        cta: "How the pieces fit",
        to: "/graph",
    },
    {
        area: "Tool telemetry",
        claim: "Even the internal tools are measured.",
        how: "Every run of every repo script is logged, so a tool nobody uses gets noticed and retired.",
        cta: "Tooling usage",
        to: "/telemetry",
    },
    {
        area: "Observability",
        claim: "The apps report their errors and slow requests.",
        how: "Browser and server share one trace, so a slow click can be followed to the query behind it.",
        cta: "How it's wired",
        to: "/wiki/packages/observability/readme",
    },
]);
</script>
