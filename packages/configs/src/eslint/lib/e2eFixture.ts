import playwright from "eslint-plugin-playwright";

const { plugins, rules } = playwright.configs["flat/recommended"];

const e2eFixture: object = {
    files: ["**/e2e/**/*.spec.ts"],
    plugins,
    rules: {
        ...rules,
        // A shared step named `expect…` asserts, so a test that ends in one has its assertion
        "playwright/expect-expect": ["warn", { assertFunctionPatterns: ["^expect"] }],
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    {
                        name: "@playwright/test",
                        importNames: ["test"],
                        message:
                            "Import `test` from @monorepo/configs/playwright/utils/test, whose `page` fails the test on browser console output.",
                    },
                ],
            },
        ],
    },
};

export default e2eFixture;
