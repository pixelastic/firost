---
title: dirname
---

<div class="lead">
  Returns the current script directory path.
</div>

`dirname()`

## Examples

```js
const __dirname = dirname();
```

## Notes

This is a polyfill to the old (pre-ESM) `__dirname` global. It returns the
absolute path to the script calling the `dirname()` method.
