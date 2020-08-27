---
title: await readJsonUrl(url[, options])
---

Returns the content of the JSON url `url` as a JavaScript object.

## Examples

```js
const data = await readJsonUrl(
  'https://api.reddit.com/r/DMToolkit/api/info?id=t3_i0ved3'
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
be saved on disk in this directory as JSON files. To clear the cache, simply
delete the directory.
