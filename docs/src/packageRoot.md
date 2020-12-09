---
title: packageRoot
---

<div class="lead">
  Returns the package root path of the specified filename. If no filename is given,
  will return the package root of the current file. The module root is where the
  closest <code>package.json</code> is found.
</div>

`packageRoot(filepath)`


## Examples

```js
packageRoot(); 
// /home/tim/projects/firost

packageRoot('~/projects/aberlaas/lib/main.js'); 
// /home/tim/projects/aberlaas/
```
