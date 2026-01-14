---
title: select
---

<div class="lead">
  Present a list of choices to the user and return the selected value. Throws an error
  on <code>CTRL-C</code>, but does not end the process.
</div>

`await select(message, choices)`

## Examples

```js
const color = await select('Pick a color', ['red', { name: 'Vert', value: 'green' }, 'blue']);

try {
  const choice = await select('Choose an option', ['Option 1', 'Option 2']);
} catch (err) {
  console.log("Selection cancelled");
  return;
}
console.log('User selected:', choice);
```
