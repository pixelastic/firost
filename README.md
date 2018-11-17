# > firost

Async glob, read and write files.

I was getting tired of having to write the same helpers and wrappers for
reading/writing files, so I packaged the best libraries and made an API that
works well with `async`/`await`.

## `glob(pattern)`

Returns an array of filepaths matching the specified glob pattern.

```js
const paths = await firost.glob('./src/**/*.css');
```

## `download(destination, content)`

Download a file to specific path on disk

```js
await firost.download('http://www.example.com/file.jpg', './example.jpg');
```

## `isDirectory(path)`

Checks if the given path exists and is a directory

```js
if (await firost.isDirectory('./dist')) {
  console.info('Website created');
}
```

## `isFile(path)`

Checks if the given path exists and is a file

```js
if (await firost.isFile('./package.json')) {
  console.info('File exists');
}
```

## `mkdirp(path)`

Creates a set of nested directories if they don't yet exist.

```js
await firost.mkdirp('./dist/css');
```


## `read(path)`

Returns the textual content of a file located at the specified filepath.

```js
const content = await firost.read('./src/css/style.css');
```

## `readJson(path)`

Returns the content of a JSON file as a JavaScript object.

```js
const data = await firost.readJson('./records.json');
```

## `readJsonUrl(url)`

Returns the content of a JSON URL as a JavaScript object.

```js
const data = await firost.readJsonUrl('http://www.example.com/data.json');
```

## `spinner(max)`

Creates a spinner for displaying progress of a task.

```js
const items = ['foo', 'bar', 'baz'];
const spinner = firost.spinner(42);
_.each(items, item => {
  spinner.tick(item);
});
spinner.succeed('All items scanned');
```

## `shell(command)`

Run the given command in a shell. Returns `stdout`, throws with `stderr`.

```js
try {
  const result = await firost.shell('git checkout -b master');
  console.info('Created branch master');
} catch (err) {
  console.info('Count not create master');
  console.error(err);
}
```

## `urlToFilepath(url)`

Converts an URL into a filepath suitable for writing the file to disk.

```js
const filepath = firost.urlToFilepath('http://www.example.com/path/file.html?foo=bar`);
// http/www.example.com/path/file_foo-bar.html
```

## `write(destination, content)`

Write content to a file on disk. This will create all needed directories if they
don't exist.

```js
await firost.write('./dist/content.txt', 'This is my content');
```

## `writeJson(destination, data)`

Write data to a JSON file on disk. Keys will be ordered alphabetically, for
easier diffing of the file.

```js
const records = [{ name: 'foo', value: 2 }, { value: 3, name: 'bar' }];
await firost.writeJson('./records/records.json', records);
```
