import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 93, statements: 93, functions: 83, branches: 100 },
});
