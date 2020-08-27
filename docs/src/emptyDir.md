---
title: await emptyDir(filepath)
---

Empty the content of `filepath`, but keep the directory.

## Examples

```js
// .
// └── project
//    ├── dist
//    │  ├── image.png
//    │  └── index.html
//    └── package.json

await emptyDir('./project/dist');

// .
// └── project
//    ├── dist
//    └── package.json
```
