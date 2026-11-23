import vitest from "@vitest/eslint-plugin";
import joinery from "../rules/index.ts";

const CALL_ORDER =
    "Assert the outcome (the call that matters, with `toHaveBeenCalledWith`, or the state it left) instead of which call came when; a reorder that changes nothing must not fail the spec.";

const vitestConfig = {
    files: ["**/*.spec.ts"],
    plugins: { vitest, joinery },
    rules: {
        ...vitest.configs.recommended.rules,
        "vitest/no-restricted-matchers": [
            "error",
            {
                toHaveBeenNthCalledWith: CALL_ORDER,
                "not.toHaveBeenNthCalledWith": CALL_ORDER,
                toMatchSnapshot:
                    "Assert the values that matter; a snapshot passes whatever it was first given and fails on every unrelated change.",
                toMatchInlineSnapshot:
                    "Assert the values that matter; a snapshot passes whatever it was first given and fails on every unrelated change.",
            },
        ],
        "joinery/no-implementation-details": "error",
    },
    languageOptions: {
        globals: { ...vitest.environments.env.globals },
    },
    settings: { vitest: { typecheck: true } },
};

export default vitestConfig;
