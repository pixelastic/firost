---
title: tmpDirectory([scope])
---

Returns a random temporary folder path.


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
