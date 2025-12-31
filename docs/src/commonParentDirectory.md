---
title: commonParentDirectory
---

<div class="lead">
  Given a list of filepaths, returns the closest common parent directory.
</div>

`commonParentDirectory()`

## Examples

```js
const commonParent = commonParentDirectory([
    '/path/to/somewhere/src/__tests__/main.js',
    '/path/to/somewhere/main.js',
    '/path/to/somewhere/config/',
    '/path/to/somewhere/tool.config.js'
]);
// /path/to/somewhere
```

## Notes

This doesn't test for the existence of the filepaths, it only operates on filepath strings.
