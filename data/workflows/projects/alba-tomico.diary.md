# 📓 Alba Tomico diary

What in the workflow worked and what went wrong. The format and when to write are in
[the workflows README](../../../docs/workflows/README.md#diary).

- 2026-11-28 · map · #545 · visual-baseline marks each bug fix or keep "for the scope sign-off", but scope-signoff needs nothing, so the owner signed it off before the bug list existed
- 2026-11-28 · map · #544 · app-scaffold asks the app to refuse to start on a missing variable, but the first required ones are ImageKit's from imagekit-vendor; shipped the check with none listed
- 2026-11-28 · map · #545 · every page block waited on the ImageKit spike through images; the owner had the pages built on mock views first, so images now swaps the mock for ImageKit after them
- 2026-11-28 · estimate · #544 · 5 SP, took about 45 min: marina-roustan's scaffold copied almost as-is; the token lint bans and their spec took most of it
