import { vitest } from "@monorepo/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 },
});
