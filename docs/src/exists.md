---
title: await exists(filepath)
---

Returns `true` if `filepath` exists.

## Examples

```js
await exists('~/') // true
await exists('~/nope.txt') // false
```

## Note

For convenience, this method is also available as `exist` (without the trailing
`s`).
