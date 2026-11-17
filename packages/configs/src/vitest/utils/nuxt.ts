import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { onTestFinished } from "vitest";
import { defineComponent } from "vue";

type MountOptions = Parameters<typeof mountSuspended>[1];

/**
 * Runs `use` inside a mounted component's `setup`, where a composable has the component and Nuxt
 * context it needs, and resolves once what it returns has settled. A composable that throws
 * rejects with its own error after the mount, so Vue never logs it as a setup failure.
 */
export const withSetup = async <T>(use: () => T, options?: MountOptions) => {
    let value!: Awaited<T>;
    let failure: { error: unknown } | undefined;

    const wrapper = await mountSuspended(
        defineComponent({
            setup: async () => {
                try {
                    value = await use();
                } catch (error) {
                    failure = { error };
                }

                return () => null;
            },
        }),
        options,
    );

    if (failure) throw failure.error;

    return { value, wrapper };
};

/** Answers `url` with `handler` until the current test finishes. */
export const serveEndpoint = (
    url: string,
    handler: Parameters<typeof registerEndpoint>[1],
): void => {
    onTestFinished(registerEndpoint(url, handler));
};

/** A stand-in that renders its default slot with `props`, keeping only a child's slot contract. */
export const slotStub = (props: Record<string, unknown>) =>
    defineComponent({
        setup:
            (_, { slots }) =>
            () =>
                slots.default?.(props),
    });
