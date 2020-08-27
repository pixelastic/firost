---
title: await move(source, destination)
---

Smartly move file(s) to `destination`.

`source` can be one file, an array of files or a glob pattern.

## Examples

```js
// Move one file to a directory, keeping the same name
await move('./src/index.html', './dist');

// Move one file, with a new name
await move('./src/alpha.html', './dist/beta.html');

// Move files by glob pattern
await move('./src/*.html', './dist');
```

## Notes

If `destination` already exists, it will be overwritten. If you'd like to
avoid that, you should check if `destination` [exists](/exists) first.

Errors are thrown when the following invalid operations are performed:
- `source` does not exist
- Overwriting a file with a directory
- Moving multiple inputs to the same destination file

