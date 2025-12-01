---
title: writeJson
---

<div class="lead">
  Write any JavaScript variable into a JSON file. The JSON will be
  pretty printed for easy editing. Keys will be written alphabetically for
  better diffs.
</div>

`await writeJson(data, destination[, options])`

## Examples

```js
const projects = [
  {
    name: 'firost',
    url: 'https://projects.pixelastic.com/firost/',
  },
  {
    name: 'maps',
    url: 'https://gamemaster.pixelastic.com/maps/',
  },
];
await writeJson(projects, './projects.json');
```

## Notes

Files and directories will be created if they don't exist. If `prettier` is
installed, your config will be applied to the file as well.

You can pass `sort: false` as option to prevent the alphabetical sorting of
keys. You can also pass `sort: ['key1', 'key2', ...]` to define a custom key
order, with remaining keys appended alphabetically at the end.

Supports placeholders like `<gitRoot>` (see [`absolute()`](./absolute) for details).
