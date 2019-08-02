# > firost

Async glob, read and write files.

I was getting tired of having to write the same helpers and wrappers for
reading/writing files, so I packaged the best libraries and made an API that
works well with `async`/`await`.

## `cache`

Shared singleton to used a proxy cache.

```js
cache.write('foo', 42);
cache.read('foo'); // 42
cache.has('foo'); // true
cache.has('nope'); // false

cache.write('key', { foo: ['one', 'two'], bar: { three: 3 } });
cache.read('key.foo'); // ['one', 'two'];
cache.read('key.bar.three'); // 3

cache.clear('key.foo');
cache.has('key.foo'); // false

cache.clearAll();
cache.has('key'); // false
```

## `copy(source, destination)`

Copy file(s)

```js
await firost.copy('index.html', './dist/index.html');
await firost.copy('./foo/*.html', './dist');
```

## `download(url, path)`

Download a file to specific path on disk

```js
await firost.download('http://www.example.com/file.jpg', './example.jpg');
```

## `emptyDir(path)`

Empty the content of a directory

```js
await firost.emptyDir('./foo/bar')
```

## `exists(path)`

Check if a file/directory exists

```js
await firost.exists('./foo/bar/file.ext')
```

## `glob(pattern, options = {})`

Returns an array of filepaths matching the specified glob pattern.

It will return hidden files and directories by default, but you can override it
by passing `hiddenFiles: false` or `directories: false` to the `options`
argument.

```js
const paths = await firost.glob(['./src/**/*.css', '!./src/**/_*.css']);
const noHiddenFiles = await firost.glob(['./lib/**/*.js'], { hiddenFiles: false });
const noDirectories = await firost.glob(['./lib'], { directories: false });
```

## `isDirectory(path)`

Checks if the given path is a directory

```js
if (await firost.isDirectory('./dist')) {
  console.info('Website created');
}
```

## `isFile(path)`

Checks if the given path is a file

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

## `move(source, destination)`

Move file(s)

```js
await firost.move('index.html', 'index.back.html');
await firost.move('./*.html', './dist');
```

## `prompt(question)`

Interactively ask user a question

```js
const mood = await firost.prompt('How do you feel?');
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

## `require(id)`

Alternative to the default `require()` call that works with `module.exports` and
`export default` syntax. Pass `forceReload: true` as an option to force
reloading the latest version on disk, bypassing the singleton cache.

```js
const module = firost.require('./path/to/module.js');
const updatedModule = firost.require('./path/to/module.js', { forceReload: true });
```

## `remove(target)`

Remove file(s)

```js
await firost.remove('index.back.html');
await firost.remove('*.back.html');
```

## `shell(command)`

Run the given command in a shell. Returns `stdout`, throws with `stderr` and
`exitCode`.

```js
try {
  const result = await firost.shell('git checkout -b master');
  console.info('Created branch master');
} catch (err) {
  console.error(err.message);
  console.error(err.code);
}
```

## `sleep(delay)`

Wait for a specific number of milliseconds

```js
await sleep(100); // Wait for 100 ms
```

## `urlToFilepath(url)`

Converts an URL into a filepath suitable for writing the file to disk.

```js
const filepath = firost.urlToFilepath('http://www.example.com/path/file.html?foo=bar');
// http/www.example.com/path/file_foo-bar.html
```

## `watch(pattern, callback, {watcherName})`

Watch for file change, and run specified callback with path to changed files.

```js
function doSomething(filepath, type) {
  console.info(`File ${filepath} was just ${type}`);
}
const watcher = await firost.watch('./path/to/files/*.jpg', doSomething, 'my-watcher');

// To remove the watcher:
await unwatch('my-watch');
// or await unwatch(watcher);
// To remove all watchers:
await unwatchAll();
// To force wait until all watchers are executed
await waitForWatchers();
```

## `write(content, destination)`

Write content to a file on disk.

```js
await firost.write('This is my content', './dist/content.txt');
```

## `writeJson(data, destination)`

Write data to a JSON file on disk. Keys will be ordered alphabetically, for
easier diffing of the file.

```js
const records = [{ name: 'foo', value: 2 }, { value: 3, name: 'bar' }];
await firost.writeJson(records, './records/records.json');
```
