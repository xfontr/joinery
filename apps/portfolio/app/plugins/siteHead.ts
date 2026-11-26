// A plugin rather than `app.vue`, because `error.vue` renders in its place.
export default defineNuxtPlugin(() => {
    const { localeProperties } = useNuxtApp().$i18n;

    useHead({ htmlAttrs: { lang: () => localeProperties.value.language } });

    // `nuxt-seo-utils` makes the path absolute, and drops these sizes when a page sets its own image
    useSeoMeta({
        ogImage: "/og-image.png",
        ogImageWidth: 1200,
        ogImageHeight: 630,
        twitterCard: "summary_large_image",
    });
});
