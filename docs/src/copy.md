---
title: await copy(source, destination)
---

Copy `source` file(s) to `destination`.

`source` can be one file, an array of files or a glob pattern.

## Examples

```js
// Copy one file to a directory, keeping the same name
await copy('./src/index.html', './dist');

// Copy one file, with a new name
await copy('./src/alpha.html', './dist/beta.html');

// Copy files by glob pattern
await copy('./src/*.html', './dist');
```

## Notes

If `destination` already exists, it will be overwritten. If you'd like to
avoid that, you should check if `destination` [exists](/exists) first.

Errors are thrown when the following invalid operations are performed:
- `source` does not exist
- Overwriting a file with a directory
- Copying multiple inputs to the same destination file
