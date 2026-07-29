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
