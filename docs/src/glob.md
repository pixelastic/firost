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

## Notes

If you pass relative patterns, you need to set `options.cwd` to define the reference folder.

Set `options.hiddenFiles` to `false` to not match hidden files.

Set `options.directories` to `false` to match only files, and not directories.

Set `options.absolutePaths` to `false` to return relative paths instead of
absolute ones (you need to also pass `options.cwd` for it to work).

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).

[1]: https://github.com/sindresorhus/globby#options
[2]: https://github.com/mrmlnc/fast-glob#options-3
