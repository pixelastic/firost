---
title: run
---

<div class="lead">
  Runs <code>command</code> and returns <code>{ stdout, stderr }</code>.
</div>

`await run(command[, options])`


## Examples

```js
const { stdout } = await run('echo hello'); 
// hello

const { stderr } = await run('>&2 echo world', { shell: true }); 
// world

try {
  await run('echo foo && exit 42', { shell: true });
} catch (err) {
  // err.code = 42
  // err.stdout = "foo"
}
```

## Notes

### Errors

If the command fails, an error will be raised. The error will contain `.code`,
`.stderr` and `.stdout` keys for additional context.

### Output

Both `stdout` and `stderr` of the `command` will be streamed to the current
terminal by default. You can disable this behavior by setting `options.stdout:
false` and `options.stderr: false`, respectively.

### Shell shenanigans

If your command includes shell-specific syntax (like `&&`, `>` or `"string
arguments"`), you need to set `options.shell: true` for it to be correctly
interpreted.

### Interactive input

If the command you want to run expect keyboard interaction from the user, you
need to set `options.stdin: true`.

Note that this will also force the display of `stdout` and `stderr` even if you
turned them off.

