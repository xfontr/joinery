export default defineNuxtPlugin((nuxtApp) => {
    const root = document.documentElement;

    nuxtApp.hook("page:view-transition:start", (transition) => {
        root.dataset.pageTransition = "rise";

        void transition.finished.finally(() => {
            delete root.dataset.pageTransition;
        });
    });

    // Safari restores a page from the back-forward cache with its view transitions frozen mid-run
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) window.location.reload();
    });
});
