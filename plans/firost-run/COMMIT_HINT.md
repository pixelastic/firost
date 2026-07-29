## Goal
Allow `run()` callers to pass arguments as an array, bypassing shell parsing for arguments containing spaces, metacharacters, or quotes.

## Done
When `run()` receives a `string[]`, it destructures directly into `[binary, ...args]` instead of calling `parseCommandString`. String form unchanged. Four behavioral tests cover: basic array call, spaces in args, shell metacharacters as literals, literal quotes. JSDoc updated to `{string|string[]}`.

## Key files
- `lib/run.js` — array detection branch before `parseCommandString`, JSDoc update
- `lib/__tests__/run.js` — `describe('array form')` with `it.each` covering four acceptance criteria

## Suggested type(scope)
`feat(run)` — new array overload for `run()`
