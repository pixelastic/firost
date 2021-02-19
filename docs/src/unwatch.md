---
title: unwatch
---

<div class="lead">
  Stops a watcher created by [watch](/watch/).
</div>

`await unwatch(watcher)`

## Examples

```js
// Using the watcher
const watcher = await watch('./src/*.css', () => {});
await unwatch(watcher);

// Using the watcher id
await watch('./src/*.css', () => {}, 'cssWatcher');
await unwatch('cssWatcher');
```
