import { vitest } from "@joinery/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 99, statements: 99, functions: 100, branches: 97 },
});
