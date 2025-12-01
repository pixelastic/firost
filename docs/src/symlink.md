---
title: symlink
---

<div class="lead">
  Creates a symbolic link to a file or directory. Replaces existing files, and
  create directory structure if needed.
</div>

`await symlink(filepath, target)`



## Examples

```js
await symlink('./bin/command', './lib/somewhere/run.sh');
```

## Notes

It is possible to create broken symlinks with this method; meaning the
destination does not have to exist when you create it.

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
