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
