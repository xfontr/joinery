import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SNAPSHOT_DIR } from "./paths.ts";

/**
 * Nx hashes this stdout as the `runtime` input on the build. `.report/` is gitignored, so it is
 * absent from Nx's file map and a file input over it hashes nothing at all.
 */
try {
    process.stdout.write(readFileSync(resolve(SNAPSHOT_DIR, "manifest.json"), "utf8"));
} catch {
    process.stdout.write("no-snapshot");
}
