---
title: which
---

<div class="lead">
  Returns the full path to `binary` if it exists and is executable. Returns
  `false` otherwise.
</div>

`await which(binary)`

## Examples

```js
if (!(await which('convert'))) {
  console.info('You need to install ImageMagick');
}
```
