---
title: urlToFilepath
---

<div class="lead">
  Transform any url into a strong suitable for a filepath. Useful when you want
  to download files on disk with a deterministic path
</div>

`urlToFilepath(url[, options])`

## Examples

```js
urlToFilepath(
  'https://projects.pixelastic.com/firost/index.html?version=1'
);
// https/projects.pixelastic.com/firost/index_version-1.html
```

## Notes

You can overwrite the file extension by setting `options.extension`.

```js
urlToFilepath(
  'https://projects.pixelastic.com/firost?version=1',
  {
    extension: 'html'
  }
);
// https/projects.pixelastic.com/firost_version-1.html
```

If the resulting filename is longer than 255 characters, it will be
automatically reduced to avoid triggering `ENAMETOOLONG` erorrs.
