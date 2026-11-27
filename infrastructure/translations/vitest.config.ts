import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 90, statements: 90, functions: 80, branches: 95 },
});
