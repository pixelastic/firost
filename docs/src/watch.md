---
title: watch
---

<div class="lead">
  Run <code>callback</code> whenever a <code>source</code> file changes.
</div>

`await watch(source, callback[, watcherId])`

`source` can be a file, an array of files or a glob pattern.

The callback is an `async` function called with `filepath` and `type`:
- `filepath` is the absolute path to the file triggering the callback
- `type` is either `created`, `modified` or `deleted` based on the event
  triggering the callback

## Examples

```js
await watch('./src/**/*.css', async (filepath, type) => {
  console.info(`File ${filepath} has been ${type}`);
});
```

## Notes

You can use [unwatch](/unwatch/) or [unwatchAll](/unwatchAll/) to cancel
watchers when you don't need them anymore.

When writing tests, you might find [waitForWatchers](/waitForWatchers/) useful
to wait for the next watch tick, to make sure filesystem events have enough time
to be caught.
