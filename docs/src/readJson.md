---
title: readJson
---

<div class="lead">
  Read the content of a local <code>.json</code> file and return it as a JavaScript
  object.
</div>

`await readJson(filepath)`

## Examples

```js
const data = await readJson('./records.json');
```

## Notes

Note that it will read the whole content before returning it, so might not be
suitable for large files (in which case you might want to use streams instead).
