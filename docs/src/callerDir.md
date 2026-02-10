---
title: callerDir
---

<div class="lead">
  Returns the directory of the parent of the file that called the `callerDir()` method.
</div>

`callerDir()`

## Examples

```js
// In ./node_modules/my-module/helper.js
import { callerDir } from 'firost';

export function myHelper() {
  const parentDir = callerDir();
  // If called from ./my-project/my-file.js
  // Returns: /path/to/my-project
}
```

## Notes

This is useful when creating library helpers that need to resolve paths relative to the calling project rather than the library itself.

For example, if `./my-project/my-file.js` calls `./node_modules/module/helper.js`, and that helper calls `callerDir()`, it will return `./my-project`.
