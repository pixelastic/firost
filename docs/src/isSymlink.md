---
title: isSymlink
---

<div class="lead">
  Check if a filepath point to a symbolic link. Returns <code>false</code> if
  the filepath is a regular file or directory, or if it does not exist.
</div>

`await isSymlink(filepath)`


## Examples

```js
if (await isSymlink('./bin/command')) {
  console.info('The command is a symbolic link');
}
```

## Notes

By design, this method will return `true` for broken symlinks (where the destination does
not exist).

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
