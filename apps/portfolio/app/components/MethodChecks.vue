<template>
    <ul class="flex flex-col">
        <li
            v-for="item in checks"
            :key="item.id"
            class="grid gap-2 border-t border-default py-5 md:grid-cols-9 md:gap-6"
        >
            <span class="font-mono text-meta text-muted md:col-span-2 md:pt-1.5">
                {{ $t(`method.prove.checks.${item.id}.area`) }}
            </span>
            <div class="flex flex-col gap-2 md:col-span-7">
                <span class="text-heading text-highlighted">{{ item.claim }}</span>
                <span class="text-base">{{ $t(`method.prove.checks.${item.id}.how`) }}</span>
                <ULink raw :to="item.to" class="self-start font-mono text-meta link">
                    {{ $t(`method.prove.checks.${item.id}.cta`) }} ↗
                </ULink>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
interface Props {
    /** Spec files across the repo; `null` when nothing was collected. */
    specs: number | null;
    rules: { enabled: number; inHouse: number } | null;
}

const { specs, rules } = defineProps<Props>();

const CHECKS = [
    { id: "tests", to: "/coverage" },
    { id: "accessibility", to: "/wiki/packages/configs/readme" },
    { id: "lint", to: "/telemetry" },
    { id: "repository", to: "/wiki/infrastructure/scripts/src/invariants/readme" },
    { id: "design", to: "/graph" },
    { id: "observability", to: "/wiki/packages/observability/readme" },
] as const;

const { t } = useI18n();

const claimFor = (id: (typeof CHECKS)[number]["id"]): string => {
    if (id === "tests" && specs) return t("method.prove.checks.tests.claimCount", { count: specs });
    if (id === "lint" && rules) return t("method.prove.checks.lint.claimCount", rules);
    return t(`method.prove.checks.${id}.claim`);
};

const checks = computed(() =>
    CHECKS.map((check) => ({ ...check, to: portalUrl(check.to), claim: claimFor(check.id) })),
);
</script>
