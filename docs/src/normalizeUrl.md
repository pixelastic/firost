---
title: normalizeUrl(url)
---

Normalize `url` into a deterministic format.

## Examples

```js
normalizeUrl(
  'https://projects.pixelastic.com/firost/index.html?name=tim&version=1'
);
// https://projects.pixelastic.com/firost/?name=tim&version=1
```

## Notes

In details this will:

- Remove any `/index.html` from trailing directories
- Always add a trailing slash to directories
- Sort query parameters alphabetically
