## Problem Statement

`run()` only accepts a command string, which gets split by execa's `parseCommandString` (a naive space-splitter). When a command argument contains shell-special characters (`&`, `=`, `%`, quotes), there is no way to pass it safely:

- Without `shell: true`: quotes become literal characters in the argument
- With `shell: true`: `&` is interpreted as a background operator, `%` and other chars get mangled

Callers are forced to drop down to Node's `execFile` to bypass the shell, defeating the purpose of `run()`.

## Solution

Accept an array as the `command` parameter: `run(['binary', 'arg1', 'arg2'])`. When an array is passed, skip `parseCommandString` and pass the binary and args directly to execa. This bypasses shell interpretation entirely, just like Node's `execFile`.

The string form remains the default for simple cases. The array form is the escape hatch when arguments contain special characters.

## User Stories

1. As a developer, I want to pass a URL containing `&` to `run()`, so that the `&` is treated as a literal character and not a shell background operator
2. As a developer, I want to pass arguments containing spaces without quoting gymnastics, so that `run(['echo', 'hello world'])` just works
3. As a developer, I want to pass arguments containing literal quotes, so that they are not interpreted as shell quoting
4. As a developer, I want to keep using `run('echo foo')` for simple cases, so that the common path stays easy
5. As a developer, I want to combine array form with `shell: true`, so that I can use shell features while still having safe argument passing (execa handles this natively)

## Implementation Decisions

- **Same function, overloaded signature**: `run(command)` where `command` is `string | string[]`. No new export.
- **Minimal branching**: the only change is a conditional on line 22 — if array, destructure directly; if string, use `parseCommandString`. Everything downstream is unchanged.
- **No input validation**: if the array is empty or malformed, execa's own errors are sufficient. No defensive code.
- **JSDoc updated**: `@param` type changes from `{string}` to `{string|string[]}` with a note explaining the array form.
- **execa handles `shell: true` + array natively**: no special handling needed for that combination.

## Testing Decisions

- Tests go in the existing test file alongside existing `run()` tests
- Test external behavior only (actual command output), not implementation details
- Prior art: existing tests use `captureOutput` wrapper and `vi.spyOn(__, 'execa')` patterns
- Four new test cases for array form:
  - Single-element array (`run(['ls'])`)
  - Arguments with spaces (`run(['echo', 'foo bar'])`)
  - Arguments with shell metacharacters like `&` (`run(['echo', 'a&b'])`)
  - Arguments with literal quotes (`run(['echo', '"hello"'])`)

## Out of Scope

- Migrating existing callers in other projects (oroshi's `google-login.js`, etc.) — will be done as a follow-up scan
- Changing `parseCommandString` behavior for the string form
- Adding shell-escaping utilities

## Further Notes

Post-implementation: scan all projects depending on firost for `execFile` imports or `run()` calls with quoting workarounds. Any project that imports firost but also uses `execFile` is a candidate for migration.
