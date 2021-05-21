---
title: exit
---

<div class="lead">
  Stop the current process with <code>code</code> as the exit code
</div>

`exit(code)`

## Examples

```js
// Stop with an error
exit(1); 

// Stop with a success
exit(0);
```

## Notes

This is similar to `process.exit` but I found having a convenience wrapper for
it made mocking calls in tests easier.
