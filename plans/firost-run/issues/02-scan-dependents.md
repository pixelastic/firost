## TLDR

Scan projects depending on firost for `execFile` usage or `run()` quoting workarounds.

## What to build

This is a HITL audit, not code. After issue 01 is merged and published:

- Find all packages in the projects directory that depend on firost
- In each, search for `execFile` imports or `run()` calls with quoting workarounds (escaped quotes, template literals wrapping URLs, etc.)
- Produce a list of migration candidates — callers that could switch to `run([...])` form

The known case is `google-login.js` in oroshi which uses `execFile('xdg-open', [authorizeUrl])`.

## Acceptance criteria

- [ ] All firost-dependent projects scanned
- [ ] Migration candidates listed with file paths
- [ ] Known case (oroshi `google-login.js`) confirmed as candidate
