import { eslint } from "@monorepo/configs";

export default [...eslint.createNodeConfig(), eslint.pureDomain];
