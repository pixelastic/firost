---
title: error
---

<div class="lead">
  Returns an <code>Error</code> with both a <code>.code</code> and a <code>.message</code> keys.
</div>

`error(code, message)`

## Examples

```js
throw firost.error(
  'ERROR_PARTY_SCATTERED', 
  'You must gather your party before venturing forth'
);
```

## Notes

Can be imported either as `error`, or as `firostError` for convenience.

```js
import { error as firostError } from 'firost';
// or
import { firostError } from 'firost';
```

