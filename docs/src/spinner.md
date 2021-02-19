---
title: spinner
---

<div class="lead">
  Create and control a visual spinner.
</div>

`spinner([max])`

## Examples

```js
const progress = spinner(3);

progress.tick('Doing something');      // [1/3] Doing something
progress.tick('Doing something else'); // [2/3] Doing something else
progress.tick('Finishing stuff');      // [3/3] Finishing stuff
progress.success('All tasks done');    // ✔ All tasks done
```

## Notes

If you don't pass a `max` number when instanciating the spinner, it will still
work correctly but the `[x/max]` prefix will not be displayed.

You can mark the spinner as finished with either of the `.success()`, `.failure()`
and `.info()` methods.

Using several spinners at the same time is not supported. Even if it would
technically work, the display might get glitchy.
