import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 85, statements: 85, functions: 85, branches: 80 },
});
