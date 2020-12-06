---
title: isFile
---

<div class="lead">
  Check if a filepath point to a file. Returns <code>false</code> if the
  filepath does not exist or is a directory.
</div>

`await isFile(filepath)`


## Examples

```js
if (await isFile('./package.json')) {
  console.info('File exists');
}
```
