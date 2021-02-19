---
title: unwatchAll
---

<div class="lead">
  Stops all watchers created by [watch](/watch/).
</div>

`await unwatchAll()`

## Examples

```js
await watch('./src/*.css', () => {});
await unwatchAll();
```
