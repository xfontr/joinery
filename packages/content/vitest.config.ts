import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 94, statements: 95, functions: 92, branches: 94 },
});
