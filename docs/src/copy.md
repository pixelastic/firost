---
title: copy
---

<div class="lead">
  Copy one or multiple files. <code>source</code> can accepts both literal strings as
  filepath, or glob patterns. You can also pass arrays to copy several files at
  once.
</div>

`await copy(source, destination[, options])`

## Examples

```js
// Copy one file to a directory, keeping the same name
await copy('./src/index.html', './dist');

// Copy one file, with a new name
await copy('./src/alpha.html', './dist/beta.html');

// Copy files by glob pattern
await copy('./src/*.html', './dist');

// Copy files referenced by a symlink
await copy('./link', './real-file', { resolveSymlinks: true });
```

## Notes

### Symlinks

Symlinks will not be resolved by default. If you pass `options.resolveSymlinks`
to `true`, then the actual file referenced by the symlink will be copied, not
the symlink itself.

### Error protection

This method is clever enough to understand your intent. For example, when
copying a file to a directory, it will put the file inside the directory, but
when copying a file to another file it will replace the destination.

It will also throw errors instead of performing potentially dangerous operations
like overwriting a file with a directory, or copying multiple files to the same
destination file.
