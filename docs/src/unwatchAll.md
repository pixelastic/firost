---
title: unwatchAll
---

<div class="lead">
  Stops all watchers created by <a href="/watch">watch</a>.
</div>

`await unwatchAll()`

## Examples

```js
await watch('./src/*.css', () => {});
await unwatchAll();
```
