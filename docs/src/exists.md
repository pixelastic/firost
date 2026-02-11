---
title: exists
---

<div class="lead">
  Check if a given filepath exists. It tests for both files and directories, and
  auto-expands the <code>~</code> home folder.
</div>

`await exists(filepath)`


## Examples

```js
await exists('~/') // true
await exists('~/nope.txt') // false

await exists('~/empty.txt') // true
await exists('~/empty.txt', { ignoreEmptyFiles: true }) // false
```

## Options

You can pass `ignoreEmptyFiles: true` to count empty files the same as if the
file didn't exist.