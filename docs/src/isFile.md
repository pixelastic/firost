---
title: isFile
---

<div class="lead">
  Check if a filepath point to a file. Returns <code>false</code> if the
  filepath does not exist or is a directory.
</div>

`await isFile(filepath)`


## Examples

```js
if (await isFile('./package.json')) {
  console.info('File exists');
}
```

## Note

This follows symlinks, so if `filepath` is a link to a file, it will return
`true`. If `filepath` is a link to a directory, it will return `false`.

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
