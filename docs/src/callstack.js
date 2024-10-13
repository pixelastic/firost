---
title: callstack
---

<div class="lead">
  Returns info about the callstack, from where `callstack()` is called.
</div>

`callstack()`
`callstack(n)`

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

// Or, targeting a specific depth in the callstack
// 0 is the calling file,
console.log(callstack(0));
// 1 is the parent of the calling file
console.log(callstack(1));

```
