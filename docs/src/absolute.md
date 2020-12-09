---
title: absolute
---

<div class="lead">
  Convert a relative filepath into an absolute one. Useful for normalizing
  <code>..</code> and <code>~/</code>.
</div>

`absolute(filepath)`


## Examples

```js
absolute('./index.html') // /home/tim/projects/index.html

absolute('~/.npmrc') // /home/tim/.npmrc

absolute('/tmp/nope/.././file.ext') // /tmp/file.ext
```
