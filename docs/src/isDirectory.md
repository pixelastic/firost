---
title: isDirectory
---

<div class="lead">
  Check if a filepath point to a directory. Returns <code>false</code> if the
  filepath does not exist or is a file.
</div>

`await isDirectory(filepath)`


## Examples

```js
if (await isDirectory('./dist')) {
  console.info('Directory exists');
}
```
