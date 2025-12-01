---
title: mkdirp
---

<div class="lead">
  Creates deep nested directories, just like the <code>mkdir -p</code> shell
  command. Use it to quickly create the file structure you need. If any of the
  path already exists, it will just ignore it.
</div>

`await mkdirp(filepath)`


## Examples

```js
await mkdirp('./dist/css');
```

## Notes

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
