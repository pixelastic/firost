---
title: waitForWatchers
---

<div class="lead">
  Wait just enough time for the [watchers](/watch/) to register any filesystem
  events.
</div>

`await waitForWatchers()`

## Examples

```js
await watch('./src/*.css', () => {
  console.info('Trigger!');
});
await write('body {}', './src/style.css');
// Without the following line, the process will stop
// before the watcher fire its callback
await waitForWatchers();
// Trigger!
process.exit(1);
```

## Notes

This method is meant to be used in tests, when you need to wait for filesystem
events to be registered so you can assert the expected callback is called
