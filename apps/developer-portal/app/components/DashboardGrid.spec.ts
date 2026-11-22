import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DashboardLayout, WidgetDefinition } from "~/utils/dashboardLayout";
import DashboardGrid from "./DashboardGrid.vue";

const toast = vi.hoisted(() => ({ add: vi.fn() }));
mockNuxtImport("useToast", () => () => toast);

const KEY = "grid-spec";

const WIDGETS: WidgetDefinition[] = [
    { id: "queue", label: "Queue", size: "wide" },
    { id: "health", label: "Health", size: "small" },
    { id: "extra", label: "Extra", size: "small", hidden: true },
];

const mount = async (props: { editing?: boolean; empty?: string[] } = {}) => {
    const wrapper = await mountSuspended(DashboardGrid, {
        props: { widgets: WIDGETS, storageKey: KEY, ...props },
        slots: {
            queue: () => "Queue body",
            health: () => "Health body",
            extra: () => "Extra body",
        },
    });
    await flushPromises();
    return wrapper;
};

const order = (wrapper: VueWrapper) =>
    wrapper.findAll("[data-widget-id]").map((widget) => widget.attributes("data-widget-id"));

// VueUse measures the press by `x`/`y`, which happy-dom leaves unset on a synthetic event
const pointer = (wrapper: VueWrapper, type: string, { clientX = 0, clientY = 0 } = {}) => {
    const event = new PointerEvent(type, { bubbles: true, button: 0, clientX, clientY });
    Object.defineProperties(event, { x: { value: clientX }, y: { value: clientY } });
    wrapper.find("[data-widget-id='queue'] div").element.dispatchEvent(event);
};

beforeEach(() => {
    localStorage.clear();
    toast.add.mockReset();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("DashboardGrid", () => {
    it("lays out the widgets not hidden by default, in order", async () => {
        expect(order(await mount())).toEqual(["queue", "health"]);
    });

    it("restores the layout this browser saved, once mounted", async () => {
        localStorage.setItem(
            KEY,
            JSON.stringify({
                version: 1,
                widgets: [
                    { id: "health", size: "small" },
                    { id: "queue", size: "wide" },
                ],
                hidden: [],
            } satisfies DashboardLayout),
        );

        expect(order(await mount())).toEqual(["health", "queue"]);
    });

    it("warns that changes won't keep when the saved layout can't be read, and shows the default", async () => {
        localStorage.setItem(KEY, "{not json");

        const wrapper = await mount();

        expect(order(wrapper)).toEqual(["queue", "health"]);
        expect(toast.add).toHaveBeenCalledOnce();
    });

    it("skips a widget with nothing to show, until the layout is being edited", async () => {
        expect(order(await mount({ empty: ["health"] }))).toEqual(["queue"]);
        expect(order(await mount({ empty: ["health"], editing: true }))).toEqual([
            "queue",
            "health",
        ]);
    });

    it("opens edit mode on a long press of a widget", async () => {
        vi.useFakeTimers();
        const wrapper = await mount();

        pointer(wrapper, "pointerdown");
        vi.advanceTimersByTime(600);

        expect(wrapper.emitted("update:editing")).toEqual([[true]]);
    });

    it("leaves a short press or a drag alone, since those are a click and a scroll", async () => {
        vi.useFakeTimers();
        const wrapper = await mount();

        pointer(wrapper, "pointerdown");
        pointer(wrapper, "pointerup");
        vi.advanceTimersByTime(600);
        pointer(wrapper, "pointerdown", { clientX: 0, clientY: 0 });
        pointer(wrapper, "pointermove", { clientX: 40, clientY: 0 });
        vi.advanceTimersByTime(600);

        expect(wrapper.emitted("update:editing")).toBeUndefined();
    });

    it("keeps the click that ends a long press from following the widget's link", async () => {
        vi.useFakeTimers();
        const wrapper = await mount();
        pointer(wrapper, "pointerdown");
        vi.advanceTimersByTime(600);

        const click = new MouseEvent("click", { bubbles: true, cancelable: true });
        wrapper.find("[data-widget-id='queue'] div").element.dispatchEvent(click);

        expect(click.defaultPrevented).toBe(true);
    });

    it("saves a widget removed while editing, so it stays gone on the next visit", async () => {
        const wrapper = await mount({ editing: true });

        await wrapper.find("button[aria-label='Remove Health']").trigger("click");
        await flushPromises();

        expect(order(wrapper)).toEqual(["queue"]);
        expect(JSON.parse(localStorage.getItem(KEY) ?? "{}")).toMatchObject({
            hidden: ["extra", "health"],
        });
    });

    it("puts the default layout back on Reset", async () => {
        const wrapper = await mount({ editing: true });
        await wrapper.find("button[aria-label='Move Health earlier']").trigger("click");

        const reset = wrapper.findAll("button").find((button) => button.text() === "Reset");
        await reset?.trigger("click");

        expect(order(wrapper)).toEqual(["queue", "health"]);
    });

    it("leaves edit mode on Done", async () => {
        const wrapper = await mount({ editing: true });

        await wrapper
            .findAll("button")
            .find((button) => button.text() === "Done")
            ?.trigger("click");

        expect(wrapper.emitted("update:editing")).toEqual([[false]]);
    });
});
