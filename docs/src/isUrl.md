---
title: isUrl
---

<div class="lead">
  Check if a string looks like a URL.
</div>

`isUrl(target)`


## Examples

```js
if (isUrl(input)) {
  await download(input, urlToFilepath(input));
}
```

## Note

The check is pretty loose (basically checks if starts with `https?://`), and
would validate strings that wouldn't pass a more strict format.
