import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 95, statements: 94, functions: 92, branches: 94 },
});
