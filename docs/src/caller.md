---
title: caller
---

<div class="lead">
  Returns the full path to the file that called the current script.
</div>

`caller()`


## Examples

```js
// ./project/main.js
import helper from './helper.js';
helper.foo(); // will return ./project/main.js

// ./project/helper.js
import { caller } from 'firost';
export function foo() {
    return caller();
}

```
