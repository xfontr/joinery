<template>
    <section class="bg-inverted text-highlighted surface-inverted">
        <UContainer class="py-20 lg:py-28">
            <figure class="hl-about-reveal mx-auto max-w-4xl">
                <UIcon name="i-lucide-quote" class="size-10 text-secondary md:size-12" />
                <blockquote class="mt-6">
                    <p class="font-serif text-section/snug text-balance italic md:text-pull-quote">
                        {{ $t("aboutQuote.text") }}
                    </p>
                </blockquote>
                <figcaption class="mt-6 font-sans text-meta text-default">
                    — {{ $t("aboutQuote.author") }}
                </figcaption>
            </figure>
        </UContainer>
    </section>
</template>
