---
title: which
---

<div class="lead">
  Returns the full path to <code>binary</code> if it exists and is executable. Returns
  <code>false</code> otherwise.
</div>

`await which(binary)`

## Examples

```js
if (!(await which('convert'))) {
  console.info('You need to install ImageMagick');
}
```
