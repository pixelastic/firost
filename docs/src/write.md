---
title: write
---

<div class="lead">
  Write any string to a file on disk. If a file with the same name already
  exists, it will be replaced. Files and directories that don't exist will be
  created.
</div>

`await write(content, filepath)`



## Examples

```js
await write('This is my content', './dist/content.txt');
```

## Notes

This method is intended for writing strings. You might trigger unintended
behavior if you attempt to write content expected as binary.

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
