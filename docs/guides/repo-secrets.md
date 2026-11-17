# 🔑 Provisioning the repo secrets

Five GitHub Actions secrets nothing in the repo provisions. A missing one rarely names itself, so
read the symptom column first.

## 🗂 The secrets

| Secret | Used by | Token | Symptom when missing |
| --- | --- | --- | --- |
| `PROJECTS_TOKEN` | [`pr-metadata.yml`](../../.github/workflows/pr-metadata.yml) | Classic PAT, `repo` + `project` | The workflow fails on the first PR with `gh`'s "set the GH_TOKEN environment variable" error |
| `NX_CLOUD_ACCESS_TOKEN` | [`ci.yml`](../../.github/workflows/ci.yml) `nx affected` step | Nx Cloud access token, **Read & Write** | Nothing fails: `nx affected` runs everything locally with no remote cache |
| `RELEASE_TOKEN` | [`release.yml`](../../.github/workflows/release.yml) push of the release commit and tags | Classic PAT, `repo`, on an account in the `master` ruleset's bypass list | The release commit and tags build, then `nx release`'s push is rejected with "Changes must be made through a pull request" and no GitHub Release is created |
| `NETLIFY_AUTH_TOKEN` | [`netlify-deployment.yml`](../../.github/workflows/netlify-deployment.yml) | Netlify personal access token, on an account with deploy rights on the Huella Legal project | A push to `master` fails at the Netlify CLI steps without deploying, and every PR passes with a "no Netlify token" notice instead of a preview |
| `COPILOT_GITHUB_TOKEN` | [`docs-review.yml`](../../.github/workflows/docs-review.yml) | Fine-grained PAT, account permission **Copilot Requests** | The advisory review is skipped; it is not a required check |

Set each with (reads the value from stdin, so it stays out of shell history):

```sh
gh secret set <NAME> --repo <owner>/<repo>
```

Then re-run the failed workflow run.

## 🧾 Notes per token

| Secret | Note |
| --- | --- |
| `PROJECTS_TOKEN` | `GITHUB_TOKEN` never has the `project` scope Projects v2 needs. [Classic token](https://github.com/settings/tokens) |
| `NX_CLOUD_ACCESS_TOKEN` | From the workspace's Nx Cloud page. Read & Write, or CI never populates the cache |
| `RELEASE_TOKEN` | Must belong to an account on the `master` ruleset's bypass list (an admin today) |
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens. Set an expiry and rotate before it. `NETLIFY_SITE_ID` is a repo *variable* |
| `COPILOT_GITHUB_TOKEN` | [Fine-grained token](https://github.com/settings/personal-access-tokens/new), the owner's personal account as resource owner, **Copilot Requests** account permission. Spends the owner's Copilot credits |
