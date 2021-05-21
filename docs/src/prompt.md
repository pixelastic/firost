---
title: prompt
---

<div class="lead">
  Ask a question on the commandline, and return the input answer. Throws an error
  on <code>CTRL-C</code>, but does not end the process.
</div>

`await prompt(question)`

## Examples

```js
const mood = await prompt('How do you feel?');

try {
  await prompt('Press Enter to continue, or CTRL-C to cancel');
} catch (err) {
  console.log("Skipping");
  return;
}
console.log('Continuing');
```
