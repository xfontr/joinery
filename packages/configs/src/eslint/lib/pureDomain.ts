const IMPURE = [
    "fs",
    "fs/*",
    "node:fs",
    "node:fs/*",
    "child_process",
    "node:child_process",
    "process",
    "node:process",
    "@clack/prompts",
    "**/adapters/**",
];

const pureDomain: object = {
    files: ["**/domain/**/*.ts"],
    ignores: ["**/*.spec.ts"],
    rules: {
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: IMPURE,
                        message:
                            "domain/ holds pure functions. Do the I/O in an adapters/ file and pass its result into this function as an argument.",
                    },
                ],
            },
        ],
        "no-restricted-globals": [
            "error",
            {
                name: "process",
                message:
                    "domain/ holds pure functions. Read process.env or process.argv in the command and pass the value in as an argument.",
            },
        ],
    },
};

export default pureDomain;
