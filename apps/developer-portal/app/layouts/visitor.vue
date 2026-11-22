<template>
    <div data-identity class="flex min-h-screen flex-col">
        <UContainer
            as="header"
            class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6"
        >
            <ULink to="/" class="font-display text-2xl text-highlighted italic">
                {{ $t("app.visitor.wordmark") }}
            </ULink>
            <div class="flex flex-wrap items-center gap-6">
                <nav
                    class="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm"
                    :aria-label="$t('app.visitor.navLabel')"
                >
                    <ULink to="/method" active-class="text-primary">
                        {{ $t("app.visitor.nav.method") }}
                    </ULink>
                    <ULink to="/agentic-workflows" active-class="text-primary">
                        {{ $t("app.visitor.nav.workflows") }}
                    </ULink>
                    <ULink to="/work" active-class="text-primary">
                        {{ $t("app.visitor.nav.work") }}
                    </ULink>
                    <ULink to="/about" active-class="text-primary">
                        {{ $t("app.visitor.nav.about") }}
                    </ULink>
                </nav>
                <ViewSwitch current="visitor" />
            </div>
        </UContainer>

        <main class="flex-1">
            <slot />
        </main>

        <UContainer as="footer" class="py-16">
            <ULink
                to="/overview"
                class="flex flex-col gap-2 border-t border-accented pt-8 md:flex-row md:items-baseline md:justify-between"
            >
                <span class="font-display text-heading text-highlighted">
                    {{ $t("app.visitor.footer.title") }}
                    <mark>{{ $t("app.visitor.footer.titleMark") }}</mark>
                </span>
                <span class="text-sm text-muted">{{ $t("app.visitor.footer.line") }}</span>
            </ULink>
            <p class="mt-6 flex justify-between gap-4 text-sm text-muted">
                <small>{{ $t("app.visitor.footer.copyright") }}</small>
                <small>{{ $t("app.visitor.footer.noTracking") }}</small>
            </p>
        </UContainer>
    </div>
</template>
