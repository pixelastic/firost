---
title: newFile
---

<div class="lead">
  Creates the smallest possible syntactically valid file of the specified
  extension at the specified location. Based on <a href="https://github.com/mathiasbynens/small">mathiasbynens/small</a>.
</div>

`await newFile(filepath)`

## Examples

```js
await newFile('./src/blank.html');
```

## Notes

If an extension is not supported, and empty file will be created instead.
