---
title: captureOutput
---

<div class="lead">
  Silence all output of `callback` and return it instead.
</div>

`await captureOutput(callback)`

## Examples

```js
const output = await captureOutput(async () => {
  console.info("This will not get displayed");
  await run('echo Test');
  await run('./no-existing-script.sh');
});
// actual.stdout: ["This will not get displayed", "Test"]
// actual.stderr: ["Command does not exist"]
```
