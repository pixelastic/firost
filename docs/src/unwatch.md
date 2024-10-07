---
title: unwatch
---

<div class="lead">
  Stops a watcher created by <a href="/watch">watch</a>.
</div>

`await unwatch(watcher)`

## Examples

```js
// Using the watcher
const watcher = await watch('./src/*.css', () => {});
await unwatch(watcher);

// Using the watcher name
await watch('./src/*.css', () => {}, 'cssWatcher');
await unwatch('cssWatcher');
```
