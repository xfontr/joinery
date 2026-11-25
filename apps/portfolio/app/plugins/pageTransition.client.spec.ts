import { afterEach, describe, expect, it, vi } from "vitest";

const start = async () => {
    let finish!: () => void;
    const finished = new Promise<void>((resolve) => (finish = resolve));
    await useNuxtApp().callHook("page:view-transition:start", { finished } as ViewTransition);
    return { finished, finish };
};

const show = (persisted: boolean) =>
    window.dispatchEvent(Object.assign(new Event("pageshow"), { persisted }));

afterEach(() => {
    delete document.documentElement.dataset.pageTransition;
});

describe("the page transition plugin", () => {
    it("marks the document for the rise only while a view transition runs", async () => {
        const transition = await start();

        expect(document.documentElement.dataset.pageTransition).toBe("rise");

        transition.finish();
        await transition.finished;
        await Promise.resolve();

        expect(document.documentElement.dataset.pageTransition).toBeUndefined();
    });

    it.each([
        { persisted: true, reloads: 1 },
        { persisted: false, reloads: 0 },
    ])(
        "reloads a page shown from the back-forward cache, and no other: $persisted",
        ({ persisted, reloads }) => {
            const reload = vi.spyOn(window.location, "reload").mockImplementation(() => {});

            show(persisted);

            expect(reload).toHaveBeenCalledTimes(reloads);
        },
    );
});
