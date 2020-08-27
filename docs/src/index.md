---
title: firost, a toolbox for command-line scripts
---

I write a lot of command-line scripts in JavaScript, and most of them requires
the same methods: reading and writing files (especially `.json`), creating
directory structures, running binary commands and parsing their output, handling
errors, etc.

All those seemingly simple tasks have their share of pitfalls and gotchas.
Instead of having to deal with them on each new project, I packaged higher-level
methods into `firost`.

## Installation

```
yarn add firost
// or npm install firost
```

## Usage

You can `require` the whole of `firost` and use its methods, or `require` each
method individually.

```js
// Require everything
const firost = require('firost');

// Cherry-pick what to require
const glob = require('firost/glob');
const copy = require('firost/copy');
```

## Examples

Below are a few examples of the tasks `firost` can help you with:

### Getting the current version of the package you're working on

```js
const packageRoot = require('firost/packageRoot');
const readJson = require('firost/readJson');
const path = require('path');

(async () => {
  const { version } = await readJson(
    path.resolve(packageRoot(), 'package.json')
  );
})()
```

### Read a remote JSON and write part of it on disk

```js
const readJsonUrl = require('firost/readJsonUrl');
const write = require('firost/write');

(async () => {
  const url = 
    "https://raw.githubusercontent.com/pixelastic/firost/master/package.json";
  const data = await readJsonUrl(url);

  await write(data.description, './description.txt');
})();
```

### Copy all `.css` files from `./src` to `./dist`

```js
const copy = require('firost/copy');

(async () => {
  await copy('./src/**/*.css', './dist');
})();
```
