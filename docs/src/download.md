---
title: download
---

<div class="lead">
  Download any file from the web, and save it on disk.
</div>

`await download(url, destination)`

## Examples

```js
await download(
  'https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg',
  './cover.jpg'
);
```

## Notes

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
