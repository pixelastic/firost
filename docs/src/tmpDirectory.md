---
title: tmpDirectory
---

<div class="lead">
  Generate a random path to a temporary folder, for when you need to quickly
  save files on disk but don't really care where they're stored.
</div>

`tmpDirectory([scope])`



## Examples

```js
tmpDirectory(); // /tmp/{some-random-uuid}
```

## Notes

If you don't want to clutter your temporary folder with too many random
directories, pass a `scope` to group them under the same directory.

```js
tmpDirectory('firost/scope/'); 
// /tmp/firost/scope/{some-random-uuid}
```
