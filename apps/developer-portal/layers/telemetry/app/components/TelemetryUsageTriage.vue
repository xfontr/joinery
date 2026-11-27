<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <WidgetPanel
            :title="$t('telemetryUsageTriage.scripts.title')"
            :meta="
                $t('telemetryUsageTriage.scripts.meta', { runs: MIN_RUNS, percent: failingPercent })
            "
        >
            <div class="p-4">
                <TelemetryQuadrantChart
                    :chart="scripts"
                    :kinds="callerKinds"
                    :quadrants="scriptCorners"
                    :x-label="$t('telemetryUsageTriage.scripts.x')"
                    :y-label="$t('telemetryUsageTriage.scripts.y')"
                    point-key="telemetryUsageTriage.scripts.point"
                />
                <I18nT
                    v-if="idle.length > 0"
                    keypath="telemetryUsageTriage.idle"
                    tag="p"
                    scope="global"
                    class="mt-4 text-xs text-muted"
                >
                    <template #list>
                        <span class="font-mono">{{ idleList }}</span>
                    </template>
                </I18nT>
            </div>
        </WidgetPanel>

        <WidgetPanel
            :title="$t('telemetryUsageTriage.rules.title')"
            :meta="
                $t('telemetryUsageTriage.rules.meta', {
                    disables: FOUGHT_DISABLES,
                    percent: noisyPercent,
                })
            "
        >
            <div class="p-4">
                <TelemetryQuadrantChart
                    :chart="rules"
                    :kinds="fixKinds"
                    :quadrants="ruleCorners"
                    :x-label="$t('telemetryUsageTriage.rules.x')"
                    :y-label="$t('telemetryUsageTriage.rules.y')"
                    point-key="telemetryUsageTriage.rules.point"
                />
            </div>
        </WidgetPanel>
    </div>
</template>

<script setup lang="ts">
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { FOUGHT_DISABLES, NOISY_SHARE } from "#layers/telemetry/shared/lintUsage.ts";
import { FAILING_RATE, MIN_RUNS } from "#layers/telemetry/shared/usage.ts";
import {
    ruleQuadrants,
    scriptQuadrants,
    scriptRows,
    type CallerMix,
    type FixKind,
} from "#layers/telemetry/app/utils/usageView.ts";

interface Props {
    usage: UsageArtifact;
}

const { usage } = defineProps<Props>();

const failingPercent = Math.round(FAILING_RATE * 100);
const noisyPercent = Math.round(NOISY_SHARE * 100);

const { t } = useI18n();

const CALLER_COLORS = {
    agents: "var(--usage-agent)",
    both: "var(--usage-both)",
    people: "var(--usage-person)",
} as const satisfies Record<CallerMix, string>;

const callerKinds = computed((): Record<CallerMix, { label: string; color: string }> => ({
    agents: { label: t("telemetryUsageTriage.callers.agents"), color: CALLER_COLORS.agents },
    both: { label: t("telemetryUsageTriage.callers.both"), color: CALLER_COLORS.both },
    people: { label: t("telemetryUsageTriage.callers.people"), color: CALLER_COLORS.people },
}));

const fixKinds = computed(
    (): Record<FixKind, { label: string; color: string; hollow?: boolean }> => ({
        manual: { label: t("telemetryUsageTriage.fixes.manual"), color: "var(--usage-rule)" },
        auto: {
            label: t("telemetryUsageTriage.fixes.auto"),
            color: "var(--usage-rule)",
            hollow: true,
        },
    }),
);

const scriptCorners = [
    { corner: "top-right", label: t("telemetryUsageTriage.scriptCorners.fixFirst"), bad: true },
    { corner: "top-left", label: t("telemetryUsageTriage.scriptCorners.rare") },
    { corner: "bottom-left", label: t("telemetryUsageTriage.scriptCorners.rarelyRun") },
    { corner: "bottom-right", label: t("telemetryUsageTriage.scriptCorners.workhorses") },
] as const;

const ruleCorners = [
    { corner: "top-left", label: t("telemetryUsageTriage.ruleCorners.wrong"), bad: true },
    { corner: "top-right", label: t("telemetryUsageTriage.ruleCorners.fought") },
    { corner: "bottom-right", label: t("telemetryUsageTriage.ruleCorners.noisy") },
] as const;

const rows = computed(() => scriptRows(usage));
const scripts = computed(() => scriptQuadrants(rows.value));
const rules = computed(() => ruleQuadrants(usage.lint));
const idle = computed(() => rows.value.filter((row) => row.runs === 0));
const idleList = computed(() =>
    idle.value
        .map((row) => {
            return row.last
                ? t("telemetryUsageTriage.idleLast", { name: row.name, day: row.last.slice(0, 10) })
                : t("telemetryUsageTriage.idleNever", { name: row.name });
        })
        .join(" · "),
);
</script>
