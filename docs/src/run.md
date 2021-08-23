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

## Options

| Name     | Default value     | Description                                                                           |
| -------- | ----------------- | ------------------------------------------------------------------------------------- |
| `shell`  | `false`           | Set to `true` to enable shell-specific syntax, like `&&`, `>` or `"string arguments"` |
| `env`    | `{}`              | Object of key-value pairs of environment variables to overwrite                       |
| `cwd`    | Current directory | Current working directory of the command                                              |
| `stdout` | `true`            | Set to `false` if you don't want to see `stdout` streamed to your terminal            |
| `stderr` | `true`            | Set to `false` if you don't want to see `stderr` streamed to your terminal            |
| `stdin`  | `false`           | Set to `true` to enable `stdin`, allowing keyboard input                              |

## Errors

If the command fails, an error will be raised. The error will contain `.code`,
`.stderr` and `.stdout` keys for additional context.
