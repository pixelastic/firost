# firost

Async glob, read and write files in nodejs.

## glob(pattern)

Returns an array of filepaths matching the specified glob pattern.

```js
const paths = await firost.glob('./src/**/*.css');
```

## read

Returns the textual content of a file located at the specified filepath.

```js
const content = firost.read('./src/css/style.css');
```

## write

## readJson

## writeJson

