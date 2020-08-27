---
title: urlToFilepath(url[, options])
---

Converts `url` into a filepath.

## Examples

```js
urlToFilepath(
  'https://projects.pixelastic.com/firost/index.html?version=1'
);
// https/projects.pixelastic.com/firost/index_version-1.html
```

## Notes

### Extension

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
