---
title: await writeJson(data, destination[, options])
---

Write `data` into a JSON file at `destination`.

## Examples

```js
const projects = [
  { 
    name: 'firost', 
    url: 'https://projects.pixelastic.com/firost/'
  },
  { 
    name: 'maps', 
    url: 'https://gamemaster.pixelastic.com/maps/'
  },
];
await writeJson(projects, './projects.json');
```

## Notes

Files and directories will be created if they don't exist.

### Pretty printing

The resulting JSON file will be pretty printed with `JSON.stringify`. In
addition, if you have `prettier` included in your project, it will be formatted
according to your prettier config.

### Easy diff

Keys of the resulting JSON file will be sorted alphabetically so the output is
deterministic. This helps in making diffs of the file as well as hashing them in
a consistent way. 

You can set `options.sort` to `false` if you want to disable this behavior.

