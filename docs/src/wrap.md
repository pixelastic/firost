---
title: wrap
---

<div class="lead">
  Wrap a method in another wrapper method.
</div>

`export const myMethod = wrap(__.myMethod);`

## Notes

This is useful in tests, to mock "internal" methods of a module, without
changing the public API.

One can export an object store (`__`) that contain all the methods. Methods from
`__` can be individually mocked in tests. As long as the methods themselves use
`__.methodName` rather than `methodName`, the public API still works, and each
individual method can be mocked in tests.
