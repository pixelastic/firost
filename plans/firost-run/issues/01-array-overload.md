## TLDR

Accept `string[]` in `run()` to bypass `parseCommandString` and pass args directly to execa.

## What to build

When `run()` receives an array instead of a string, skip `parseCommandString` and destructure the array directly into `[commandBinary, ...commandArgs]`. Everything downstream (execa call, options, error handling, output piping) is unchanged.

Update the JSDoc `@param` type from `{string}` to `{string|string[]}` with a note explaining the array form.

The change is in `lib/run.js`, at the line that calls `parseCommandString`. The rest of the function is untouched.

## Behavioral Tests

**Array form basics**
- it should return stdout when called with an array
- it should preserve spaces in arguments when called with an array
- it should treat shell metacharacters as literals when called with an array
- it should pass literal quotes without interpretation when called with an array

## Acceptance criteria

- [ ] `run(['echo', 'foo'])` returns `{ stdout: 'foo' }`
- [ ] `run(['echo', 'foo bar'])` returns `{ stdout: 'foo bar' }`
- [ ] `run(['echo', 'a&b'])` returns `{ stdout: 'a&b' }`
- [ ] `run(['echo', '"hello"'])` returns `{ stdout: '"hello"' }`
- [ ] String form `run('echo foo')` still works unchanged
- [ ] JSDoc updated to reflect `{string|string[]}`
