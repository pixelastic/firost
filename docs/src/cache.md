---
title: cache
---

<div class="lead">
  Simple shared singleton to store and retrieve key/value pairs.
</div>

`cache.write(key, value)`, `cache.read(key)`, `cache.has(key)`,
`cache.clear(key)`, `cache.clearAll()`

This is internally stored as a JavaScript object, and only available during
execution (nothing is persisted on disk).

It's main use case is it to short-circuit intensive and long operations, if
you've already calculated the output previously.


## Examples

```js
async function getDistantUrl(url) {
  // Define the cache key. You can use dot notation to create namespaces
  const cacheKey = `urls.${url}`;

  // Return the cached version if we already processed it
  if (cache.has(cacheKey)) {
    return cache.read(cacheKey);
  }

  const result = await fetch(url);

  // Save this result in cache before returning it
  cache.write(cacheKey, result);
  return result;
}

```
