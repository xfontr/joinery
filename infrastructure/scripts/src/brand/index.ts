#!/usr/bin/env node
import { run } from "../shared/cli.ts";
import { contrast } from "./contrast.ts";
import { extract } from "./extract.ts";

await run({ contrast, extract });
