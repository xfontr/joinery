import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import RuleIndex from "./RuleIndex.vue";

const observers: { callback: IntersectionObserverCallback }[] = [];

class FakeObserver {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(public callback: IntersectionObserverCallback) {
        observers.push(this);
    }
}

const cross = async (id: string, isIntersecting: boolean) => {
    const entries = [{ target: document.getElementById(id), isIntersecting }];
    observers
        .at(-1)!
        .callback(entries as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    await nextTick();
};

const current = (wrapper: VueWrapper) =>
    wrapper.findAll("a[aria-current]").map((link) => link.attributes("href"));

beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    for (const id of RULES) {
        const section = document.createElement("section");
        section.id = id;
        document.body.append(section);
    }
});

afterEach(() => {
    vi.unstubAllGlobals();
    for (const id of RULES) document.getElementById(id)?.remove();
});

describe("RuleIndex", () => {
    it("marks the first rule before any section has scrolled past", async () => {
        const wrapper = await mountSuspended(RuleIndex);

        expect(current(wrapper)).toEqual(["#look"]);
    });

    it("moves the mark to the section crossing the reading line, and keeps it as one leaves", async () => {
        const wrapper = await mountSuspended(RuleIndex);
        await nextTick();

        await cross("plan", true);
        await cross("plan", false);

        expect(current(wrapper)).toEqual(["#plan"]);
    });
});
