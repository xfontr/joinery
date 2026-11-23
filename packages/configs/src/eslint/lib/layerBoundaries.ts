import joinery from "../rules/index.ts";
import type { LayerBoundariesOptions } from "../rules/layerBoundaries.ts";

const layerBoundaries = (options: LayerBoundariesOptions): object => ({
    files: [
        "**/layers/**/*.ts",
        "**/layers/**/*.vue",
        ...options.kit.flatMap((path) => [`${path}**/*.ts`, `${path}**/*.vue`]),
    ],
    plugins: { joinery },
    rules: {
        "joinery/layer-boundaries": ["error", options],
    },
});

export default layerBoundaries;
