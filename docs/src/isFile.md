---
title: await isFile(filepath)
---

Returns `true` if `filepath` is a file.

## Examples

```js
if (await isFile('./package.json')) {
  console.info('File exists');
}
```
