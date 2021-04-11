---
title: readUrl
---

<div class="lead">
  Read a remote file and return its content.
</div>

`await readUrl(url[, options])`

## Examples

```js
const data = await readUrl(
  'https://en.wikipedia.org/wiki/Vincent_van_Gogh'
);
```

## Notes

### Memory Cache

Results are cached in memory by default. This means that if you try to
read the same URL twice in the same script, the second call will bypass the HTTP
call and return the cached response from the first call.

You can disable this behavior by setting `options.memoryCache` to `false`.

### Disk Cache

The cache can also be saved on disk so it can persists between runs. To enable
this behavior, set the `options.diskCache` to any directory path. Responses will
be saved on disk in this directory. To clear the cache, simply
delete the directory.

### Headers

Additional HTTP headers can be passed to the [underlying got
instance](https://github.com/sindresorhus/got#headers).
