<template>
    <div data-identity class="flex min-h-screen flex-col">
        <a
            href="#content"
            class="sr-only z-50 bg-primary text-sm font-semibold text-inverted focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-3"
            >{{ $t("app.skipLink") }}</a
        >

        <UContainer
            as="header"
            class="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 py-6"
        >
            <ULink to="/" class="text-base font-semibold tracking-tight text-highlighted">
                {{ $t("app.visitor.wordmark") }}
            </ULink>
            <UModal fullscreen :title="$t('app.visitor.menu.title')">
                <UButton
                    :label="$t('app.visitor.menu.open')"
                    color="neutral"
                    variant="link"
                    class="p-0 text-base text-highlighted md:hidden"
                />

                <template #content="{ close }">
                    <UContainer class="flex min-h-full flex-col py-6">
                        <div class="flex items-baseline justify-between gap-6">
                            <ULink
                                to="/"
                                class="text-base font-semibold tracking-tight text-highlighted"
                                @click="close"
                            >
                                {{ $t("app.visitor.wordmark") }}
                            </ULink>
                            <UButton
                                :label="$t('app.visitor.menu.close')"
                                color="neutral"
                                variant="link"
                                class="p-0 text-base text-highlighted"
                                @click="close"
                            />
                        </div>

                        <nav
                            class="my-auto flex flex-col items-end gap-6 py-16 text-right"
                            :aria-label="$t('app.visitor.navLabel')"
                        >
                            <ULink
                                v-for="(item, order) in NAV"
                                :key="item.to"
                                :to="item.to"
                                data-menu-link
                                :style="{ '--order': order }"
                                :class="current(item.to) ? 'text-primary' : 'text-highlighted'"
                                class="text-title"
                                :aria-current="current(item.to)"
                                @click="close"
                            >
                                {{ $t(`app.visitor.nav.${item.key}`) }}
                            </ULink>
                        </nav>

                        <div class="flex items-center justify-between gap-4 pt-10">
                            <PortalLink />
                            <small class="text-sm text-muted">
                                {{ $t("app.visitor.footer.noTracking") }}
                            </small>
                        </div>
                    </UContainer>
                </template>
            </UModal>

            <div class="hidden flex-wrap items-baseline gap-x-7 md:flex">
                <nav
                    class="flex flex-wrap items-baseline gap-x-7 gap-y-1 text-base"
                    :aria-label="$t('app.visitor.navLabel')"
                >
                    <ULink
                        v-for="item in NAV"
                        :key="item.to"
                        :to="item.to"
                        :class="
                            current(item.to)
                                ? 'text-primary underline decoration-primary underline-offset-8'
                                : 'text-highlighted hover:text-primary'
                        "
                        :aria-current="current(item.to)"
                    >
                        {{ $t(`app.visitor.nav.${item.key}`) }}
                    </ULink>
                </nav>
                <PortalLink />
            </div>
        </UContainer>

        <main id="content" tabindex="-1" class="flex-1 outline-none">
            <slot />
        </main>

        <UContainer as="footer" class="pt-36 pb-10">
            <ULink
                :to="portal"
                class="group flex flex-col gap-6 border-t border-accented pt-8 md:flex-row md:items-end md:justify-between"
            >
                <span class="max-w-3xl text-section text-highlighted group-hover:text-primary">
                    {{ $t("app.visitor.footer.title") }}
                    <mark>{{ $t("app.visitor.footer.titleMark") }}</mark>
                </span>
                <span class="font-mono text-meta text-muted">
                    {{ $t("app.visitor.footer.line") }} ↗
                </span>
            </ULink>
            <p class="mt-16 flex justify-between gap-4 font-mono text-meta text-muted">
                <small>{{ $t("app.visitor.footer.copyright") }}</small>
                <small>{{ $t("app.visitor.footer.noTracking") }}</small>
            </p>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
const NAV = [
    { to: "/method", key: "method" },
    { to: "/agentic-workflows", key: "workflows" },
    { to: "/work", key: "work" },
    { to: "/about", key: "about" },
] as const;

const route = useRoute();
const portal = portalUrl("/");
// `ULink` sets `aria-current` only on an exact match, which would leave Work unmarked on a case study
const current = (to: string) =>
    route.path === to || route.path.startsWith(`${to}/`) ? "page" : undefined;
</script>
