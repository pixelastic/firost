---
title: await glob
---

<div class="lead">
  Given a glob or array of glob patterns (like <code>*.css</code> or
  <code>**/*.css</code>), will return an array of absolute paths to matching
  files on disk
</div>

`await glob(pattern[, options])`

## Examples

```js
// All css files in ./src
const files = await glob('./src/**/*.css');

// All .css files in ./src, except those
// starting with an underscore
const files = await glob(['./src/**/*.css', '!./src/**/_*.css']);
```

## Differences with `absolute()` and `resolve()`

Firost provides three levels of filepath processing:

- **[`absolute()`](./absolute)**: Converts a single filepath to an absolute path (synchronous)
- **[`resolve()`](./resolve)**: Converts one or multiple filepaths to an array of absolute paths (synchronous, no glob expansion)
- **`glob()`**: Expands patterns and returns matching files (asynchronous, checks existence)

Use `glob()` when you need to match files using patterns and verify they exist on disk.

## Notes

Set `options.cwd` to define the root folder to use for globs.

Set `options.hiddenFiles` to `false` to not match hidden files.

Set `options.directories` to `false` to match only files, and not directories.

Set `options.absolutePaths` to `false` to return relative paths instead of absolute ones.

You can also pass any of [globby][1] or [fast-glob][2] options.

[1]: https://github.com/sindresorhus/globby#options
[2]: https://github.com/mrmlnc/fast-glob#options-3
