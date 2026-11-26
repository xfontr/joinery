<template>
    <div class="flex flex-col gap-5 text-sm">
        <div class="flex flex-wrap items-center gap-2">
            <StatusPill :label :tone />
            <span v-if="kindText" class="flex items-center gap-1 text-xs text-muted">
                <UIcon v-if="kindIconName" :name="kindIconName" class="size-3.5" />
                {{ kindText }}
            </span>
            <UBadge
                v-if="capability.extra"
                :label="$t('workflowCapabilityDetail.extra')"
                color="neutral"
                variant="subtle"
                size="sm"
            />
            <span v-if="groupOff" class="ml-auto text-xs text-dimmed">
                {{ $t("workflowCapabilityDetail.offWith", { group: groupOff }) }}
            </span>
            <USwitch
                v-else-if="editable && capability.optional"
                :model-value="capability.enabled"
                size="sm"
                :label="
                    capability.enabled
                        ? $t('workflowCapabilityDetail.switch.on')
                        : $t('workflowCapabilityDetail.switch.off')
                "
                class="ml-auto"
                @update:model-value="(on) => emit('toggle', on)"
            />
            <span v-else-if="capability.optional" class="ml-auto text-xs text-dimmed">
                {{ $t("workflowCapabilityDetail.optional") }}
            </span>
        </div>

        <p v-if="capability.summary" class="text-muted">{{ capability.summary }}</p>
        <p v-if="capability.note" class="text-muted italic">{{ capability.note }}</p>
        <p v-if="why" class="text-muted">
            {{ why }}
        </p>
        <section v-if="settleable" class="flex flex-col gap-2">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.settle") }}
            </h3>
            <div v-if="settled" class="flex items-center gap-2">
                <span class="flex-1 text-muted">{{
                    $t("workflowCapabilityDetail.settle.settled")
                }}</span>
                <UButton
                    :label="$t('workflowCapabilityDetail.settle.undo')"
                    icon="i-lucide-undo-2"
                    color="neutral"
                    variant="outline"
                    size="xs"
                    @click="emit('settle', null)"
                />
            </div>
            <template v-else>
                <UInput
                    v-model="settleNote"
                    :placeholder="$t('workflowCapabilityDetail.settle.notePlaceholder')"
                    :aria-label="$t('workflowCapabilityDetail.settle.noteLabel')"
                    class="w-full"
                />
                <div class="flex gap-2">
                    <UButton
                        :label="$t('workflowCapabilityDetail.settle.done')"
                        icon="i-lucide-check"
                        size="xs"
                        :disabled="noteMissing"
                        @click="settle('done')"
                    />
                    <UButton
                        :label="$t('workflowCapabilityDetail.settle.skip')"
                        icon="i-lucide-circle-slash"
                        color="neutral"
                        variant="outline"
                        size="xs"
                        :disabled="noteMissing"
                        @click="settle('skipped')"
                    />
                </div>
            </template>
        </section>

        <code
            v-if="fileCommand"
            class="block rounded-md bg-elevated px-2 py-1 font-mono text-xs select-all"
            >{{ fileCommand }}</code
        >

        <section v-for="link in links" :key="link.title" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ link.title }}
            </h3>
            <ul class="flex flex-wrap gap-1.5">
                <li v-for="target in link.ids" :key="target">
                    <UButton
                        :label="titles[target] ?? target"
                        color="neutral"
                        variant="subtle"
                        size="xs"
                        @click="emit('select', target)"
                    />
                </li>
            </ul>
        </section>

        <section v-if="capability.issues.length > 0" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.tickets") }}
            </h3>
            <ul class="flex flex-col gap-1">
                <li v-for="issue in capability.issues" :key="issue.number">
                    <a
                        :href="issue.url"
                        target="_blank"
                        class="flex items-start gap-2 hover:underline"
                    >
                        <UIcon
                            :name="issueIcon(issue)"
                            class="mt-0.5 size-3.5 shrink-0"
                            :class="delivered(issue) ? 'tone-good' : 'text-dimmed'"
                        />
                        <span class="font-mono text-xs text-dimmed">#{{ issue.number }}</span>
                        <span class="min-w-0 flex-1">{{ issue.title }}</span>
                        <span v-if="statusOf[issue.number]" class="shrink-0 text-xs text-muted">{{
                            statusOf[issue.number]
                        }}</span>
                    </a>
                </li>
            </ul>
        </section>

        <section v-if="activitySummary" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.activity") }}
            </h3>
            <p class="text-muted">{{ activitySummary }}</p>
        </section>

        <section v-if="capability.reuse" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.startFrom") }}
            </h3>
            <p v-if="capability.reuse" class="text-muted">
                {{ reuseLabel }}
                <code v-if="capability.reuse.from" class="font-mono text-xs break-all">{{
                    capability.reuse.from
                }}</code>
            </p>
        </section>

        <section v-if="capability.doneWhen.length > 0" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.doneWhen") }}
            </h3>
            <ul class="list-disc pl-4 text-muted">
                <li v-for="line in capability.doneWhen" :key="line">{{ line }}</li>
            </ul>
        </section>

        <section v-if="capability.lessons.length > 0" class="flex flex-col gap-1.5">
            <h3 class="text-xs font-semibold tracking-wide text-dimmed uppercase">
                {{ $t("workflowCapabilityDetail.headings.lessons") }}
            </h3>
            <ul class="flex flex-col gap-1.5 text-muted">
                <li v-for="lesson in capability.lessons" :key="lesson.text">
                    {{ lesson.text }}
                    <span class="font-mono text-xs text-dimmed">
                        {{ lesson.issues.map((number) => `#${number}`).join(" ") }}
                    </span>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { CapabilityActivity } from "#layers/workflows/app/utils/workflowActivity.ts";
import {
    ticketStatus,
    type CapabilityView,
    type SettledState,
    type SnapshotIssue,
} from "#layers/workflows/shared/workflows.ts";

interface Props {
    capability: CapabilityView;
    /** The project id, so a block with nothing filed can show the command that files it. */
    project?: string | null;
    /** Capability id to its title, for the blocks it needs and unblocks. */
    titles?: Record<string, string>;
    editable?: boolean;
    /** Whether a block with no ticket can be marked done or skipped from here. */
    canSettle?: boolean;
    activity?: CapabilityActivity | null;
    /** The title of the group holding this capability when that group is switched off. */
    groupOff?: string | null;
}

const {
    capability,
    project = null,
    titles = {},
    editable = false,
    canSettle = false,
    activity = null,
    groupOff = null,
} = defineProps<Props>();
const emit = defineEmits<{
    toggle: [on: boolean];
    select: [capability: string];
    settle: [settlement: { status: SettledState; note: string } | null];
}>();

const { t } = useI18n();

const label = computed(() => t(`workflows.capabilityState.${capability.state}`));
const tone = computed(() => capabilityStateTone(capability.state));
const kindText = computed(() =>
    capability.kind === "build" ? null : t(`workflows.blockKind.${capability.kind}`),
);
const kindIconName = computed(() => blockKindIcon(capability.kind) ?? undefined);
const unfiled = computed(() => capability.issues.every(({ reason }) => reason === "not_planned"));
const settled = computed(
    () => unfiled.value && (capability.state === "done" || capability.state === "skipped"),
);
const settleable = computed(() => canSettle && unfiled.value && capability.state !== "off");
const settleNote = ref("");
const noteMissing = computed(() => !settleNote.value.trim());
const settle = (status: SettledState): void => {
    emit("settle", { status, note: settleNote.value.trim() });
    settleNote.value = "";
};
const fileCommand = computed(() =>
    project && unfiled.value && ["can-file", "waiting-on-you"].includes(capability.state)
        ? `pnpm workflow:file ${project} ${capability.id}`
        : null,
);
/** Why it sits where it does, in the words a reader acts on. */
const why = computed(() => {
    const waiting = capability.waitingOn.map((id) => titles[id] ?? id).join(", ");

    switch (capability.state) {
        case "waits":
            return t("workflowCapabilityDetail.why.waits", { waiting });
        case "blocked":
            return waiting
                ? t("workflowCapabilityDetail.why.blocked", { waiting })
                : t("workflowCapabilityDetail.why.blockedOpen");
        case "can-file":
            return t("workflowCapabilityDetail.why.canFile");
        case "waiting-on-you":
            if (!unfiled.value) return t("workflowCapabilityDetail.why.yours");
            return canSettle
                ? t("workflowCapabilityDetail.why.yoursSettle")
                : t("workflowCapabilityDetail.why.yoursUnfiled");
        case "ready":
            return t("workflowCapabilityDetail.why.ready");
        default:
            return null;
    }
});
/** An open ticket's status, naming its open blockers when it has any. */
const statusOf = computed(() =>
    Object.fromEntries(
        capability.issues
            .filter((issue) => issue.state === "open")
            .map((issue) => {
                const status = ticketStatus(issue);
                const blockers = issue.blockedBy
                    .filter((blocker) => blocker.open)
                    .map((blocker) => `#${blocker.number}`);

                return [
                    issue.number,
                    status === "blocked"
                        ? t("workflowCapabilityDetail.blockedBy", { blockers: blockers.join(" ") })
                        : t(`workflows.ticketStatus.${status}`),
                ];
            }),
    ),
);

const links = computed(() =>
    [
        { title: t("workflowCapabilityDetail.headings.needs"), ids: capability.needs },
        { title: t("workflowCapabilityDetail.headings.unblocks"), ids: capability.unblocks },
    ].filter(({ ids }) => ids.length > 0),
);
const activitySummary = computed(() => {
    if (!activity || capability.issues.length === 0) return null;
    if (activity.commits === 0) return t("workflowCapabilityDetail.activity.none");

    return t("workflowCapabilityDetail.activity.summary", {
        commits: t("workflowCapabilityDetail.activity.commits", activity.commits),
        days: t("workflowCapabilityDetail.activity.days", activity.days),
        tickets: t("workflowCapabilityDetail.activity.tickets", activity.tickets),
        day: calendarDay(activity.lastDay!),
    });
});

const reuseLabel = computed(() =>
    capability.reuse ? t(`workflows.reusePlan.${capability.reuse.plan}`) : "",
);

const delivered = (issue: SnapshotIssue): boolean =>
    issue.state === "closed" && issue.reason !== "not_planned";

const issueIcon = (issue: SnapshotIssue): string => {
    if (issue.state === "open") return "i-lucide-circle-dot";
    return issue.reason === "not_planned" ? "i-lucide-circle-slash" : "i-lucide-circle-check";
};
</script>
