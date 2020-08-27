---
title: await unwatch(watcher)
---

Stops a watcher created by [watch](/watch/).


## Examples

```js
// Using the watcher
const watcher = await watch('./src/*.css', () => {});
await unwatch(watcher);

// Using the watcher id
await watch('./src/*.css', () => {}, 'cssWatcher');
await unwatch('cssWatcher');
```
