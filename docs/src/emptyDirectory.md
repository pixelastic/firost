---
title: emptyDirectory
---

<div class="lead">
  Delete every files and sub folders of a specific directory, but keep the
  directory. This is an alternative to <code> remove</code> which will not keep the
  directory.
</div>

`await emptyDirectory(filepath)`


## Examples

```js
// .
// └── project
//    ├── dist
//    │  ├── image.png
//    │  └── index.html
//    └── package.json

await emptyDirectory('./project/dist');

// .
// └── project
//    ├── dist
//    └── package.json
```

## Notes
