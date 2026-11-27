import { repoProblems } from "../lib/repoProblems.ts";

const problems = await repoProblems();

for (const { file, message } of problems) {
    // eslint-disable-next-line no-console -- each problem is this CLI's output
    console.error(`✗ ${file}: ${message}`);
}

if (problems.length > 0) {
    // eslint-disable-next-line no-console -- the fix instruction closes the report
    console.error(`\n${problems.length} problem(s). Fix them before pushing.`);
    process.exitCode = 1;
} else {
    // eslint-disable-next-line no-console -- the all-clear is this CLI's output
    console.log("✓ Links, audits, decisions and workflow files hold.");
}
