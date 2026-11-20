---
title: prompt
---

<div class="lead">
  Ask a question on the commandline, and return the input answer. Throws an error
  on <code>CTRL-C</code>, but does not end the process.
</div>

`await prompt(question, options)`

## Options

| Option    | Description                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `prefill` | Value already typed in the input. The user can edit it, or press Enter to accept it. |

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

const name = await prompt('Package name?', { prefill: 'my-package' });
```
