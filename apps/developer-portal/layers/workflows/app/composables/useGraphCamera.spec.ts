import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { ref } from "vue";
import { describe, expect, it } from "vitest";
import { useGraphCamera } from "./useGraphCamera.ts";

const WIDTH = 800;
const HEIGHT = 576;

const viewport = ref({
    getBoundingClientRect: () => ({ width: WIDTH, height: HEIGHT, left: 0, top: 0 }),
} as HTMLElement);

/** Where a block's box lands on screen once the camera has framed it. */
const onScreen = (
    camera: { x: number; y: number; k: number },
    block: { x: number; y: number },
) => ({
    left: camera.x + block.x * camera.k,
    right: camera.x + (block.x + NODE_WIDTH) * camera.k,
    top: camera.y + block.y * camera.k,
    bottom: camera.y + (block.y + NODE_HEIGHT) * camera.k,
});

describe("useGraphCamera", () => {
    it("keeps the anchor on screen when what follows it is too wide to frame readably", async () => {
        const anchor = { x: 0, y: 0 };
        const next = Array.from({ length: 12 }, (_, index) => ({ x: 300 + index * 280, y: 0 }));
        const {
            value: { camera, fit },
        } = await withSetup(() =>
            useGraphCamera(viewport, () => ({ nodes: [anchor, ...next], anchor })),
        );

        fit(false);

        const box = onScreen(camera, anchor);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(WIDTH);
        expect(box.top).toBeGreaterThanOrEqual(0);
        expect(box.bottom).toBeLessThanOrEqual(HEIGHT);
    });

    it("centres a frame that fits, rather than pushing it toward the anchor", async () => {
        const anchor = { x: 1000, y: 1000 };
        const next = { x: 1300, y: 1000 };
        const {
            value: { camera, fit },
        } = await withSetup(() =>
            useGraphCamera(viewport, () => ({ nodes: [anchor, next], anchor })),
        );

        fit(false);

        const middle = (onScreen(camera, anchor).left + onScreen(camera, next).right) / 2;
        expect(middle).toBeCloseTo(WIDTH / 2);
    });
});
