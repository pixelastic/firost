---
title: error(code, message)
---

Returns an `Error` with both a `.code` and a `.message` keys.

## Examples

```js
throw firost.error(
  'ERROR_PARTY_SCATTERED', 
  'You must gather your party before venturing forth'
);
```
