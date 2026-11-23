import joinery from "../rules/index.ts";

const rules = { "joinery/lookup-table-shape": "error" };

const constTables: object = { files: ["**/*.ts"], plugins: { joinery }, rules };

const constTablesVue: object = { files: ["**/*.vue"], plugins: { joinery }, rules };

export { constTables, constTablesVue };
