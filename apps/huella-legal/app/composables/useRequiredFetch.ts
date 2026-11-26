import type { Ref } from "vue";

interface RequiredFetch {
    <T>(url: string): Promise<Ref<T | undefined>>;
    <T>(url: string, fallback: () => T): Promise<Ref<T>>;
}

/** A cached read of one of the core's routes that fails the page when the route does. */
export const useRequiredFetch: RequiredFetch = async (url: string, fallback?: () => unknown) => {
    const request = useCachedFetch<unknown>(url, { default: fallback });

    await useFailOnError(request);

    return request.data as Ref<never>;
};
