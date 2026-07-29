## Goal
Audit firost dependents for `run()` quoting workarounds and `execFile` usage that could migrate to the new `run([...])` array overload.

## Done
Scanned 7 firost-dependent projects (aberlaas, emulation, norska, pietro, renovate-config-aberlaas, shortwheel, solkan). Found 2 confirmed migration candidates: aberlaas `compress/lib/png.js` (file paths joined with spaces) and emulation `backupSaveFileLocally.js` (quoted filepath workaround). Most other `run()` calls use static strings or require shell features (ssh, `$()`, env var expansion). Updated plan guidance with findings.

## Key files
- `plans/firost-run/state.json` — marked audit issue done with recap
- `plans/firost-run/GUIDANCE.md` — added discoveries about dependent scan results

## Suggested type(scope)
`chore(firost-run)` — audit-only, no production code changes
