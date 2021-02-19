---
title: require
---

<div class="lead">
  Requires `module`.
</div>

`require(module[, options])`

## Examples

```js
const myModule = firost.require('./path/to/module.js');
```

## Notes

This is similar to the builtin `require`, but having a wrapper proves itself
useful in tests when you cannot mock the builtin `require`.

### Force reload

Set `options.forceReload: true` to force reloading the module, bypassing the
cache.

```js
const updatedModule = firost.require('./path/to/module.js', {
  forceReload: true,
});
```

