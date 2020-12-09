---
title: await glob
---

<div class="lead">
  Given a glob or array of glob patterns (like <code>*.css</code> or
  <code>**/*.css</code>), will return an array of matching files on disk.
</div>

`await glob(pattern[, options])`


## Examples

```js
// All css files in ./src
const files = await glob('./src/**/*.css');

// All .css files in ./src, except those 
// starting with an underscore
const files = await glob([
  './src/**/*.css',
  '!./src/**/_*.css'
]);
```

## Notes

Set `options.hiddenFiles` to `false` to not match hidden files.

Set `options.directories` to `false` to match only files, and not directories.
