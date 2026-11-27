#!/usr/bin/env node
import { run } from "../shared/cli.ts";
import { commands } from "./main.ts";

await run(commands);
