---
title: callstack
---

<div class="lead">
  Returns an array of the callstack, from where `callstack()` is called.
</div>

`callstack()`

## Examples

```js
// example.js
function myFunction() {
  const myStack = callstack();
  console.log(myStack[0]); 
  // {
  //   "filepath": "/path/to/example.js",
  //   "function": "myFunction"
  // }
}

```
