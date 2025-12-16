---
title: move
---

<div class="lead">
  Move one or multiple files. `source` can accepts both literal strings as
  filepath, or glob patterns. You can also pass arrays to move several files at
  once.
</div>

`await move(source, destination)`


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

This method is clever enough to understand your intent. For example, when
copying a file to a directory, it will put the file inside the directory, but
when copying a file to another file it will replace the destination.

It will also throw errors instead of performing potentially dangerous operations
like overwriting a file with a directory, or copying multiple files to the same
destination file.

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).

