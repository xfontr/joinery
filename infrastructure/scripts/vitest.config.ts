import { vitest } from "@monorepo/configs";

export default vitest.createNodeConfig({
    thresholds: { lines: 78, statements: 78, functions: 80, branches: 73 },
});
