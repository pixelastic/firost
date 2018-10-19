# firost

Async glob, read and write files in nodejs.

I was getting tired of having to write the same helpers and wrappers for
reading/writing files, so I packaged the best libraries and made an API that
works well with `async`/`await`.


## glob(pattern)

Returns an array of filepaths matching the specified glob pattern.

```js
const paths = await firost.glob('./src/**/*.css');
```

## isDirectory(path)

Checks if the given path exists and is a directory

```js
if (await firost.isDirectory('./dist')) {
  console.info("Website created");
}
```

## mkdirp(path)

Creates a set of nested directories if they don't yet exist.

```js
await firost.mkdirp('./dist/css');
```

## read(path)

Returns the textual content of a file located at the specified filepath.

```js
const content = await firost.read('./src/css/style.css');
```

## readJson(path)

Returns the content of a JSON file as a JavaScript object.

```js
const data = await firost.readJson('./records.json');
```

## shell(command)

Execute the given command in a shell. Returns `stdout`, throws with `stderr`.

```js
try {
  const result = await firost.shell('git checkout -b master');
  console.info("Created branch master");
} catch(err) {
  console.info("Count not create master")
  console.error(err);
}
```

## write(destination, content)

Write content to a file on disk. This will create all needed directories if they
don't exist.

```js
await firost.write('./dist/content.txt', "This is my content");
```

## writeJson

Write data to a JSON file on disk. Keys will be ordered alphabetically, for
easier diffing of the file.

```js
const records = [{ name: 'foo', value: 2 }, { value: 3, name: 'bar' }];
await firost.writeJson('./records/records.json, records);
```

