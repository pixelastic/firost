<!--
  This page was automatically generated.
  DO NOT EDIT IT MANUALLY.
  Instead, update .github/README.template.md
  and run aberlaas readme
-->

# firost

<div class="lead">
  When writing command-line tools in JavaScript, you end up doing the same
  common tasks over and over again: reading and writing files, running binary
  commands, querying JSON APIs, etc. Firost contains higher-level functions to
  make this work easier and less error-prone.
</div>

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

## Documentation

The complete documentation can be found on https://projects.pixelastic.com/firost/