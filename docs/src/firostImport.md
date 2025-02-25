---
title: firostImport
---

<div class="lead">
  Imports <code>module</code>.
</div>

`await firostImport(module[, options])`

## Examples

```js
const myModule = await firostImport('./path/to/module.js');
```

## Notes

This is similar to the builtin `import`, but having a wrapper proves itself
useful in tests when you cannot mock the builtin `import`.

It will also transparently import ESM, CommonJS or JSON files

### Force reload

Set `options.forceReload: true` to force reloading the module, bypassing the
cache.

```js
const updatedModule = await firostImport('./path/to/module.js', {
  forceReload: true,
});
```

