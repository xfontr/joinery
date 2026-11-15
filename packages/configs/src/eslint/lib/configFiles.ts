import tseslint from "typescript-eslint";

// A project's root `*.config.ts` sits outside its tsconfig, so it is linted without type information.
const configFiles: object = {
    ...tseslint.configs.disableTypeChecked,
    files: ["*.config.ts"],
};

export default configFiles;
