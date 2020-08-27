---
title: await remove(source)
---

Delete `source` file(s).

`source can be one file, an array of files or a glob pattern.

## Examples

```js
await remove('index.back.html');
await remove('*.back.html');
```

## Notes

This method is called `remove` because `delete` is a reserved keyword in
JavaScript.
