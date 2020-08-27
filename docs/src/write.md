---
title: await write(content, filepath)
---

Write `content` to `filepath`.

## Examples

```js
await write('This is my content', './dist/content.txt');
```

## Notes

Files and directories will be created if they don't exist.
