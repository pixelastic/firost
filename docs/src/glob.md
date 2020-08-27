---
title: await glob(pattern[, options])
---

Returns an array of filepaths matching the glob `pattern`.


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

### Hidden files

Hidden files and folders (like `.git/` or `.eslintrc.js`) are returned by
default.

Set `options.hiddenFiles` to `false` to disable this behavior.

### Directories

Patterns like `**/*` will return both files and directories. If you're not
interested in directories, set `options.directories` to `false`.
