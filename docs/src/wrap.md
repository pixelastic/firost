---
title: wrap
---

<div class="lead">
  Wrap a method from a parent object in a wrapper function.
</div>

`export const myMethod = wrap(__, 'myMethod');`

## Usage

```javascript
const __ = {
  getName() {
    return 'firost';
  },
  greetings() {
    const name = __.getName();
    return `Hello, ${name}`;
  }
};

export const greetings = wrap(__, 'greetings');
```

## Notes

This is useful in tests, to mock "internal" methods of a module, without
changing the public API.

One can export an object store (`__`) that contain all the methods. Methods from
`__` can be individually mocked in tests. As long as the methods themselves use
`__.methodName` rather than `methodName`, the public API still works, and each
individual method can be mocked in tests.

Works with both synchronous and asynchronous functions.
