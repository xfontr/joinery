import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import ArticleShareBar from "./ShareBar.vue";

const MESSAGES = {
    shareBar: { cite: "cite", linkCopied: "link copied", print: "print", share: "share" },
};

const track = vi.fn();
let toast: ReturnType<typeof useToast>;

const toasted = () => toast.toasts.value.map(({ title }) => title);

const PROPS = { title: "La acción", url: "https://huella.test/la-accion" };

const browser = { share: vi.fn(), write: vi.fn(), print: vi.fn() };

class ClipboardItem {
    constructor(readonly items: Record<string, string>) {}
}

// happy-dom defines clipboard on Navigator.prototype, and useClipboard checks `"clipboard" in navigator`.
const withoutClipboard = (): void => {
    const prototype = Object.getPrototypeOf(navigator);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "clipboard")!;

    Reflect.deleteProperty(navigator, "clipboard");
    Reflect.deleteProperty(prototype, "clipboard");
    onTestFinished(() => Object.defineProperty(prototype, "clipboard", descriptor));
};

const withShareSheet = (share: typeof browser.share): void => {
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
};

const button = (wrapper: VueWrapper, key: string) => wrapper.find(`button[aria-label="${key}"]`);

beforeEach(async () => {
    vi.clearAllMocks();
    const { $i18n, hooks } = useNuxtApp();

    $i18n.mergeLocaleMessage("es-ES", MESSAGES);
    onTestFinished(hooks.hook("analytics:event", ({ name, params }) => track(name, params)));
    toast = (await withSetup(() => useToast())).value;
    toast.clear();
    Object.defineProperty(navigator, "clipboard", {
        value: { write: browser.write },
        configurable: true,
    });
    vi.stubGlobal("ClipboardItem", ClipboardItem);
    vi.stubGlobal("print", browser.print);
});

afterEach(() => {
    Reflect.deleteProperty(navigator, "share");
    Reflect.deleteProperty(navigator, "canShare");
    Reflect.deleteProperty(navigator, "clipboard");
    vi.unstubAllGlobals();
});

describe("share bar", () => {
    it("hands the given title and URL to the native share sheet, never the current location", async () => {
        withShareSheet(browser.share.mockResolvedValue(undefined));
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        await button(wrapper, "share").trigger("click");

        expect(browser.share).toHaveBeenCalledWith(PROPS);
        expect(browser.write).not.toHaveBeenCalled();
    });

    it("treats a dismissed share sheet as a choice, not an error", async () => {
        withShareSheet(browser.share.mockRejectedValue(new DOMException("", "AbortError")));
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        await button(wrapper, "share").trigger("click");
        await flushPromises();

        expect(browser.write).not.toHaveBeenCalled();
        expect(toasted()).toEqual([]);
        expect(track).not.toHaveBeenCalled();
    });

    it("copies the URL instead when the browser refuses the share sheet", async () => {
        withShareSheet(browser.share.mockRejectedValue(new DOMException("", "NotAllowedError")));
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        await button(wrapper, "share").trigger("click");
        await flushPromises();

        expect(browser.write).toHaveBeenCalled();
        expect(toasted()).toEqual(["link copied"]);
        expect(track).toHaveBeenCalledWith("share", { method: "copy_link" });
    });

    it("claims no copy when the share sheet fails and there is no clipboard to fall back on", async () => {
        withoutClipboard();
        withShareSheet(browser.share.mockRejectedValue(new DOMException("", "NotAllowedError")));
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        await button(wrapper, "share").trigger("click");
        await flushPromises();

        expect(toasted()).toEqual([]);
    });

    it("copies the URL where there is no share sheet, and confirms it in a toast", async () => {
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        await button(wrapper, "share").trigger("click");
        await flushPromises();

        expect(browser.write).toHaveBeenCalledWith([
            new ClipboardItem({ "text/plain": PROPS.url }),
        ]);
        expect(toasted()).toEqual(["link copied"]);
    });

    it("hides the share button where the browser can neither share nor copy", async () => {
        withoutClipboard();
        const wrapper = await mountSuspended(ArticleShareBar, { props: PROPS });

        expect(button(wrapper, "share").exists()).toBe(false);
    });
});
