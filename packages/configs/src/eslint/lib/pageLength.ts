const pageLength: object = {
    files: ["**/pages/**/*.vue"],
    ignores: ["**/pages/lab/**"],
    rules: {
        "vue/max-lines-per-block": ["error", { template: 60, script: 50, skipBlankLines: true }],
    },
};

export default pageLength;
