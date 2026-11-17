<template>
    <main class="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-10 md:px-8">
        <header class="flex items-center justify-between gap-4 text-sm">
            <span class="font-mono">monorepo</span>
            <nav class="flex gap-4">
                <a href="#apps" class="underline">Apps</a>
                <a href="#how" class="underline">How it's built</a>
                <a :href="developerHref" class="underline" data-lab="developer-link">
                    Developer view
                </a>
            </nav>
        </header>

        <section v-if="statement" class="flex flex-col gap-4">
            <h1 class="text-6xl font-semibold text-highlighted md:text-8xl">
                Software built with care, sped up by AI, for the people who use it.
            </h1>
            <p class="max-w-2xl text-base">
                One person and a team of AI agents build and run the apps below. Every decision,
                audit and plan behind them is public here.
            </p>
        </section>

        <section id="apps" class="flex flex-col gap-6" data-lab="first-content">
            <h2 class="font-mono text-sm uppercase">Shipped apps · {{ shipped.length }}</h2>
            <article v-for="app in shipped" :key="app.name" class="flex flex-col gap-2">
                <div class="aspect-video w-full border border-default bg-elevated" />
                <h3 class="text-xl font-semibold">{{ app.title }}</h3>
                <p class="text-base text-muted">{{ app.line }}</p>
            </article>
        </section>

        <section id="how" class="flex flex-col gap-4">
            <h2 class="font-mono text-sm uppercase">How it's built</h2>
            <p class="max-w-2xl text-base">
                In the last {{ usage?.windowDays ?? "—" }} days, AI agents ran
                {{ usage?.agentShare ?? "—" }}% of the repo's {{ usage?.runs ?? "—" }} script runs.
                {{ specs }} test files guard {{ coverage ?? "—" }}% of the code's lines, and
                {{ decisions.length }} written decisions record why it looks the way it does.
            </p>
            <pre class="overflow-x-auto font-mono text-sm">{{ figure }}</pre>
        </section>

        <section class="flex flex-col gap-2">
            <h2 class="font-mono text-sm uppercase">Latest decisions</h2>
            <a
                v-for="report in latest"
                :key="report.id"
                :href="`/decisions/${report.id}`"
                class="flex gap-4 border-t border-default py-2 text-base"
            >
                <span class="font-mono">{{ report.number }}</span>
                <span>{{ report.title }}</span>
            </a>
        </section>
    </main>
</template>

<script setup lang="ts">
import { sortDecisions } from "#layers/decisions/shared/decisionReports.ts";
import { scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";

interface Props {
    developerHref: string;
    statement: boolean;
}

defineProps<Props>();

const [{ data: projectsSnapshot }, { data: metricsSnapshot }, { data: coverageSnapshot }] =
    await Promise.all([useSnapshot("projects"), useSnapshot("metrics"), useSnapshot("coverage")]);
const { data: usageSnapshot } = await useSnapshot("usage");

const nodes = computed(() => projectsSnapshot.value?.projects?.projects ?? []);

const LINES: Record<string, { title: string; line: string }> = {
    "@monorepo/huella-legal": {
        title: "Huella Legal",
        line: "A law magazine for students and general readers.",
    },
    "@monorepo/marina-roustan": {
        title: "Marina Roustan",
        line: "A therapist's site, rebuilt from an old WordPress one.",
    },
};

const shipped = computed(() =>
    nodes.value
        .filter((node) => node.tags.includes("type:app") && !node.tags.includes("scope:internal"))
        .map((node) => ({
            name: node.name,
            ...(LINES[node.name] ?? { title: node.name, line: "" }),
        })),
);

const usage = computed(() => {
    const artifact = usageSnapshot.value?.usage;
    if (!artifact) return null;
    const sum = sumDays(scriptRows(artifact));
    return {
        windowDays: artifact.windowDays,
        runs: sum.runs,
        agentShare: sum.runs === 0 ? 0 : Math.round((sum.agent / sum.runs) * 100),
    };
});

const specs = computed(
    () =>
        metricsSnapshot.value?.metrics?.projects.reduce((total, row) => total + row.specs, 0) ??
        "—",
);
const coverage = computed(() => coverageSnapshot.value?.coverage?.totals?.lines ?? null);

const decisions = useDecisionReports();
const latest = computed(() => sortDecisions(decisions.value, "newest").slice(0, 5));

const short = (name: string): string => name.replace("@monorepo/", "");

const figure = computed(() =>
    nodes.value
        .filter((node) => node.root.startsWith("apps/"))
        .map((node) => {
            const uses = node.dependsOn.map(short).filter((name) => name !== "configs");
            return `${short(node.name).padEnd(18)}──▶ ${uses.join(", ") || "configs only"}`;
        })
        .join("\n"),
);
</script>
