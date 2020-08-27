---
title: await which(binary)
---

Returns the full path to `binary` if it exists and is executable. Returns
`false` otherwise.

## Examples

```js
if (!(await which('convert'))) {
  console.info('You need to install ImageMagick');
}
```
