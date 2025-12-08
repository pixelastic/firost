---
title: resolve
---

<div class="lead">
  Convert one or multiple filepaths into an array of absolute filepaths. Unlike
  <code>glob()</code>, this does not expand patterns or check for existence.
</div>

`resolve(input)`

## Examples

```js
// Single filepath returns an array
resolve('/tmp/file.txt') // ['/tmp/file.txt']

// Relative files are treated as relative to the file calling resolve()
resolve('./index.html') // ['/home/tim/projects/index.html']

// Arrays of filepaths
resolve(['/tmp/one.txt', './two.txt']) // ['/tmp/one.txt', '/home/tim/projects/two.txt']

// Placeholders are supported
resolve('<gitRoot>/package.json') // ['/home/tim/projects/package.json']
```

## Differences with `absolute()` and `glob()`

Firost provides three levels of filepath processing:

- **[`absolute()`](./absolute)**: Converts a single filepath to an absolute path (synchronous)
- **`resolve()`**: Converts one or multiple filepaths to an array of absolute paths (synchronous, no glob expansion)
- **[`glob()`](./glob)**: Expands patterns and returns matching files (asynchronous, checks existence)

Use `resolve()` when you need to normalize multiple filepaths without glob expansion or existence checking.

## Placeholders

Supports placeholders like `<gitRoot>`, `<packageRoot>`, and `<cwd>` (see [`absolute()`](./absolute) for details).
