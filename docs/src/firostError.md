---
title: firostError
---

<div class="lead">
  Returns an <code>Error</code> with both a <code>.code</code> and a <code>.message</code> keys.
</div>

`firostError(code, message)`

## Examples

```js
throw firostError(
  'ERROR_PARTY_SCATTERED', 
  'You must gather your party before venturing forth'
);
```
