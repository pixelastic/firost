---
title: gitRoot(filepath)
---

Returns the git repository root path of the specified `filepath`.

If no `filepath` is specified, will return the git root of the script calling
the method.


## Examples

```js
gitRoot(); // /home/tim/projects/firost

gitRoot(
  '~/projects/aberlaas/lib/main.js'
); // /home/tim/projects/aberlaas/
```

## Notes

This checks for the closest `.git/` directory up the file structure, so it might
not work when using git submodules as they have their own `.git/` directory.
