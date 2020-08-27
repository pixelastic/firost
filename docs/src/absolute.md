---
title: absolute(filepath)
---

Returns `filepath` as a normalized absolute path.

Handles `./`, `../` and `~/` segments.

## Examples

```js
absolute('./index.html') // /home/tim/projects/index.html

absolute('~/.npmrc') // /home/tim/.npmrc

absolute('/tmp/nope/.././file.ext') // /tmp/file.ext
```
