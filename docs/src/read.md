---
title: read
---

<div class="lead">
  Read the content of a file on disk and returns it as a string.
</div>

`await read(filepath)`


## Examples

```js
const content = await read('./src/css/style.css');
```

## Notes

Note that it will read the whole content before returning it, so might not be
suitable for large files (in which case you might want to use streams instead).
