<template>
    <ul class="grid gap-x-6 md:grid-cols-3">
        <li
            v-for="item in checks"
            :key="item.id"
            class="flex flex-col gap-2 border-t border-default pt-4 pb-6"
        >
            <span class="text-base font-medium text-highlighted">
                {{ $t(`method.prove.checks.${item.id}.area`) }}
            </span>
            <span class="text-base text-muted">{{ item.claim }}</span>
            <ULink raw :to="item.to" class="mt-auto self-start pt-2 font-mono text-meta link">
                {{ $t(`method.prove.checks.${item.id}.cta`) }} ↗
            </ULink>
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

/** A count past fifty, rounded down to a multiple of it, so the claim doesn't date by the week. */
const roundDown = (count: number): number => (count < 50 ? count : Math.floor(count / 50) * 50);

const claimFor = (id: (typeof CHECKS)[number]["id"]): string => {
    if (id === "tests" && specs)
        return t("method.prove.checks.tests.claimCount", { count: roundDown(specs) });
    if (id === "lint" && rules) {
        return t("method.prove.checks.lint.claimCount", { count: roundDown(rules.enabled) });
    }
    return t(`method.prove.checks.${id}.claim`);
};

const checks = computed(() =>
    CHECKS.map((check) => ({ ...check, to: portalUrl(check.to), claim: claimFor(check.id) })),
);
</script>
