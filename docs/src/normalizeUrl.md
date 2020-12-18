---
title: normalizeUrl
---

<div class="lead">
  Normalize any URL for easy comparison. This will alphabetically sort query
  parameters and remove useless `/index.html` for example.
</div>

`normalizeUrl(url)`

## Examples

```js
normalizeUrl(
  'https://projects.pixelastic.com/firost/index.html?name=tim&version=1'
);
// https://projects.pixelastic.com/firost/?name=tim&version=1
```
