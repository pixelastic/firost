---
title: packageRoot(filepath)
---

Returns the package root path of the specified `filepath` (ie. where
`package.json` is located).

If no `filepath` is specified, will return the package root of the script calling
the method.

## Examples

```js
packageRoot(); 
// /home/tim/projects/firost

packageRoot('~/projects/aberlaas/lib/main.js'); 
// /home/tim/projects/aberlaas/
```
