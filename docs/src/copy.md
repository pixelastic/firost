---
title: copy
---

<div class="lead">
  Copy one or multiple files. <code>source</code> can accepts both literal strings as
  filepath, or glob patterns. You can also pass arrays to copy several files at
  once.
</div>

`await copy(source, destination)`

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

This method is clever enough to understand your intent. For example, when
copying a file to a directory, it will put the file inside the directory, but
when copying a file to another file it will replace the destination.

It will also throw errors instead of performing potentially dangerous operations
like overwriting a file with a directory, or copying multiple files to the same
destination file.
