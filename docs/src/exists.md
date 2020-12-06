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
```

## Note

For convenience, this method is also available as `exist` (without the trailing
`s`).
