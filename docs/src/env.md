---
title: env(name)
---

<div class="lead">
  Read an environment variable.
</div>

`env(name)`

## Examples

```js
const isProduction = env('NODE_ENV') === 'production';
```

## Notes

This is a simple wrapper around `process.env` but allows for easier mocking in
tests.
