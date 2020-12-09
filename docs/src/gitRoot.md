---
title: gitRoot
---

<div class="lead">
  Returns the git root path of the specified filename. If no filename is given,
  will return the git root of the current file.
</div>

`gitRoot(filepath)`


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
