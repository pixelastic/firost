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
// Relative files are treated as relative to the file calling absolute()
absolute('./index.html') // /home/tim/projects/index.html

// Tilde are expanded to full path
absolute('~/.npmrc') // /home/tim/.npmrc

// Relative .. and . in absolute paths are flattened
absolute('/tmp/nope/.././file.ext') // /tmp/file.ext
```

## Spread syntax

You can use both `absolute('./path/to/file.txt')` or `absolute('./path', 'to',
'file.txt')`, similarly to how `path.resolve` works.
