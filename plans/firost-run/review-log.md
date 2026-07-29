## Issue 01 — Array overload
### Blank lines around describe block
```javascript
  });
  describe('array form', () => {
```
**Problem:** Missing blank lines before/after `describe('array form')` block
**Reason skipped:** File already uses no blank lines between sibling blocks (e.g. line 37-38); consistent as-is

### let actual without null init
```javascript
      let actual;
```
**Problem:** `let actual` not initialized to `null`
**Reason skipped:** The `= null` pattern is documented for try/catch error tests; this non-error pattern matches existing usage on line 11 of the same file

### toHaveProperty vs toEqual
```javascript
      expect(actual).toHaveProperty('stdout', expected);
```
**Problem:** Uses `toHaveProperty` instead of `toEqual` for full object assertion
**Reason skipped:** Matches existing test style throughout this file (lines 16, 23, etc.); checking a single known property is reasonable here

### String form regression test
**Problem:** No new explicit test asserting string form still works after the change
**Reason skipped:** 14+ existing string-form tests already cover this; the change only adds a branch before the existing code path, no regression surface
