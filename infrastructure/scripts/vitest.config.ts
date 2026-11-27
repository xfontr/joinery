import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 74, statements: 74, functions: 77, branches: 70 },
});
