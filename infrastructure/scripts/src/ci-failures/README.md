# 🚨 ci-failures

What failed on a PR and why, in one call: check counts, pending checks by name, each failed GitHub
Actions job cut to its error lines, and a failed SonarCloud gate's open issues. Written for agents.

```sh
pnpm ci:failures          # the current branch's PR
pnpm ci:failures 287      # any PR, by number, URL or branch
```

Exits 1 while any check is failing; pending checks don't count.

## Structure

```
main.ts               checks → group → one report per failed check
adapters/gh.ts        the PR, its checks, a failed job's log
adapters/sonar.ts     a PR's open SonarCloud issues (public API, no token)
adapters/files.ts     saves the untrimmed log to the OS temp dir
domain/checks.ts      grouping, reading job ids and Sonar PRs from links, log-prefix stripping
```

## What each kind of check prints

| Check | Prints |
| --- | --- |
| GitHub Actions job | The failing log, stripped of prefixes and cut to error lines by `excerpt` in [`../shared/domain/logs.ts`](../shared/domain/logs.ts). The full log's path is printed too |
| SonarCloud Code Analysis | Each open issue as `severity rule path:line — message` |
| Anything else | Name, description and link |
