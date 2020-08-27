---
title: await unwatchAll()
---

Stops all watchers created by [watch](/watch/).


## Examples

```js
await watch('./src/*.css', () => {});
await unwatchAll();
```
