<template>
    <ShellIdea page="Front page">
        <section class="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-10 pb-16 md:px-10 md:pt-20">
            <h1 class="font-serif text-8xl leading-none text-highlighted md:text-9xl">
                Built by <em class="text-primary">rules.</em>
            </h1>
            <p class="max-w-2xl text-2xl text-highlighted">{{ intro.hello }}</p>
            <p class="max-w-xl text-base text-muted">{{ intro.lead }}</p>
        </section>

        <section class="mx-auto max-w-6xl px-5 pb-24 md:px-10">
            <p class="pb-6 font-mono text-xs text-muted uppercase">Five rules, and their proof</p>
            <article
                v-for="(item, index) in principles"
                :key="item.rule"
                class="grid gap-4 border-t border-accented py-10 md:grid-cols-12"
            >
                <p class="font-serif text-8xl leading-none text-primary md:col-span-2">
                    {{ index + 1 }}
                </p>
                <div class="flex flex-col gap-4 md:col-span-7">
                    <h2 class="font-serif text-5xl leading-none text-highlighted">
                        {{ item.rule }}
                    </h2>
                    <p class="max-w-xl text-lg">{{ item.line }}</p>
                </div>
                <NuxtLink :to="linkFor(item.to)" class="flex flex-col gap-1 self-end md:col-span-3">
                    <span class="font-mono text-xs text-muted uppercase">Proof</span>
                    <span
                        class="text-base text-highlighted underline decoration-primary underline-offset-4"
                    >
                        {{ item.proof }} →
                    </span>
                </NuxtLink>
            </article>
        </section>

        <section id="workflows" class="mx-auto max-w-6xl px-5 pb-24 md:px-10">
            <NuxtLink
                to="/lab/idea/workflows"
                class="group grid items-center gap-10 border-t border-accented pt-10 md:grid-cols-12"
            >
                <div class="flex flex-col gap-5 md:col-span-6">
                    <p class="font-mono text-xs text-muted uppercase">Rule 3, in practice</p>
                    <h2 class="font-serif text-6xl leading-none text-highlighted">
                        Every project <em class="text-primary">runs on a map.</em>
                    </h2>
                    <p class="max-w-md text-lg">
                        {{ workflows.pitch }} Each block knows what it waits on, so work starts in
                        the right order.
                    </p>
                    <span
                        class="font-serif text-2xl text-highlighted underline decoration-primary underline-offset-8 group-hover:text-primary"
                    >
                        See how projects are run →
                    </span>
                </div>
                <div class="flex justify-center md:col-span-6">
                    <LabWorkflowGlyph
                        v-if="glyph"
                        :map="glyph"
                        label="A real project plan: every block, and what each one waits on"
                    />
                </div>
            </NuxtLink>
        </section>

        <section id="work" class="bg-muted">
            <div class="mx-auto max-w-6xl px-5 py-20 md:px-10">
                <h2 class="font-serif text-6xl leading-none text-highlighted">
                    What the rules <em>made</em>
                </h2>
                <div class="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
                    <article
                        v-for="item in work"
                        :key="item.slug"
                        class="flex flex-col gap-3"
                        :class="item.shot ? 'md:col-span-3 md:grid md:grid-cols-3 md:gap-x-10' : ''"
                    >
                        <img
                            v-if="item.shot"
                            :src="item.shot"
                            :alt="`${item.name}, the new site`"
                            width="1440"
                            height="900"
                            class="w-full border border-default md:col-span-2 md:row-span-6"
                        />
                        <p class="font-mono text-xs text-muted uppercase">
                            {{ item.kind }} · {{ item.stage }}
                        </p>
                        <h3 class="font-serif text-4xl leading-none text-highlighted">
                            {{ item.name }}
                        </h3>
                        <p class="text-base">{{ item.what }}</p>
                        <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                            <NuxtLink
                                v-if="item.slug === 'huella-legal'"
                                to="/lab/idea/work/huella-legal"
                                class="text-primary underline underline-offset-4"
                            >
                                Read the story
                            </NuxtLink>
                            <a :href="item.href" class="underline underline-offset-4">
                                {{ item.cta }}
                            </a>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="mx-auto grid max-w-6xl gap-6 px-5 pt-20 md:grid-cols-3 md:px-10">
            <NuxtLink
                to="/lab/idea/method"
                class="flex flex-col gap-2 border-t border-default pt-5"
            >
                <span class="font-mono text-xs text-muted uppercase">Go deeper</span>
                <span class="font-serif text-3xl text-highlighted"
                    >How it's made, rule by rule →</span
                >
            </NuxtLink>
            <NuxtLink
                to="/lab/idea/work/huella-legal"
                class="flex flex-col gap-2 border-t border-default pt-5"
            >
                <span class="font-mono text-xs text-muted uppercase">A case</span>
                <span class="font-serif text-3xl text-highlighted"
                    >Huella Legal, start to finish →</span
                >
            </NuxtLink>
            <NuxtLink to="/lab/idea/craft" class="flex flex-col gap-2 border-t border-default pt-5">
                <span class="font-mono text-xs text-muted uppercase">The craft</span>
                <span class="font-serif text-3xl text-highlighted">Careful, and measured →</span>
            </NuxtLink>
        </section>
    </ShellIdea>
</template>

<script setup lang="ts">
import ShellIdea from "~/lab/idea/ShellIdea.vue";
import { intro, principles, work, workflows } from "~/lab/fixtures";
import LabWorkflowGlyph from "~/lab/LabWorkflowGlyph.vue";
import { GLYPH, layoutMap } from "~/lab/workflowMap";

definePageMeta({ layout: false });

const linkFor = (to: string): string => (to === "craft" ? "/lab/idea/craft" : to);

const { data } = await useWorkflows();
const glyph = computed(() => {
    const view = data.value.projects.find((project) => project.project.id === "huella-legal");
    return view ? layoutMap(view, GLYPH) : null;
});
</script>
