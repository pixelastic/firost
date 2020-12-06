---
title: remove
---

<div class="lead">
  Delete any file or directory at the specified filepath. If the path is
  a directory, all its children will be deleted as well. Filepath accepts both
  literal string or glob patterns. You can also pass an array to remove several
  files at once.
</div>

`await remove(source)`


## Examples

```js
await remove('index.back.html');
await remove('*.back.html');
await remove(['index.back.html', './tmp/*.json']);
```
