## Guidance

- Source: `lib/run.js`
- Tests: `lib/__tests__/run.js`
- Test runner: `yarn vitest` from `lib/` directory
- Run single test file: `yarn vitest run __tests__/run.js` from `lib/`
- Tests use `captureOutput` wrapper to suppress real-time piping
- Tests use `vi.spyOn(__, 'execa')` to verify execa call signatures
- The `__` object is exported from `run.js` specifically for test spying
- execa v9.6.1 — supports `execa(binary, argsArray)` natively

## Discoveries

### Issue 02 — Scan dependents
- Only 2 real migration candidates across all dependents; most `run()` calls use static strings or need shell features (ssh, `$()`, `$EDITOR`)
- emulation project wraps firost `run` in its own `remote/run.js` for ssh — those calls are inherently shell-dependent and not candidates
- oroshi is not in `/home/tim/local/www/projects/`, only found in `/home/tim/local/tmp/oroshi` with no package.json
