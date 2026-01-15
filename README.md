# > firost

Async glob, read and write files.

I was getting tired of having to write the same helpers and wrappers for
reading/writing files, so I packaged the best libraries and made an API that
works well with `async`/`await`.

## Filesystem methods

These methods help in finding, reading, moving and writing files on disk.

### `absolute(filepath)`

Converts any filepath to an absolute path, resolving `~/` to home.

```js
absolute('../path/to/file/oops/../.') // /absolute/path/to/file
absolute('~/.npmrc') // /home/tim/.npmrc
```

### `copy(source, destination)`

Copy file(s)

```js
await copy('index.html', './dist/index.html');
await copy('./foo/*.html', './dist');
```

### `download(url, path)`

Download a file to specific path on disk

```js
await download('http://www.example.com/file.jpg', './example.jpg');
```

### `emptyDir(path)`

Empty the content of a directory

```js
await emptyDir('./foo/bar');
```

### `exists(path)`

Check if a file/directory exists

```js
await exists('./foo/bar/file.ext');
```

### `gitRoot()`

Returns the path of the closest directory holding a .git folder.

```js
gitRoot(); // /home/tim/projects/firost
gitRoot('~/projects/aberlaas/lib/main.js'); // /home/tim/projects/aberlaas/
```

### `glob(pattern, options = {})`

Returns an array of filepaths matching the specified glob pattern.

It will return hidden files and directories by default, but you can override it
by passing `hiddenFiles: false` or `directories: false` to the `options`
argument.

```js
const paths = await glob(['./src/**/*.css', '!./src/**/_*.css']);
const noHiddenFiles = await glob(['./lib/**/*.js'], {
  hiddenFiles: false,
});
const noDirectories = await glob(['./lib'], { directories: false });
```

### `isDirectory(path)`

Checks if the given path is a directory

```js
if (await isDirectory('./dist')) {
  console.info('Website created');
}
```

### `isFile(path)`

Checks if the given path is a file

```js
if (await isFile('./package.json')) {
  console.info('File exists');
}
```

### `mkdirp(path)`

Creates a set of nested directories if they don't yet exist.

```js
await mkdirp('./dist/css');
```

### `move(source, destination)`

Move file(s)

```js
await move('index.html', 'index.back.html');
await move('./*.html', './dist');
```

### `packageRoot()`

Returns the path of the closest directory holding a package.json file.

```js
packageRoot(); // /home/tim/projects/firost
packageRoot('~/projects/aberlaas/lib/main.js'); // /home/tim/projects/aberlaas/
```


### `read(path)`

Returns the textual content of a file located at the specified filepath.

```js
const content = await read('./src/css/style.css');
```

### `readJson(path)`

Returns the content of a JSON file as a JavaScript object.

```js
const data = await readJson('./records.json');
```

### `readJsonUrl(url)`

Returns the content of a JSON URL as a JavaScript object.

```js
const data = await readJsonUrl('http://www.example.com/data.json');
```

### `remove(target)`

Remove file(s)

```js
await remove('index.back.html');
await remove('*.back.html');
```

### `urlToFilepath(url)`

Converts an URL into a filepath suitable for writing the file to disk.

```js
const filepath = urlToFilepath(
  'http://www.example.com/path/file.html?foo=bar'
);
// http/www.example.com/path/file_foo-bar.html

// Also works with relative utls
const filepath = urlToFilepath('path/file.html?foo=bar');
// path/file_foo-bar.html
```

### `watch(pattern, callback, {watcherName})`

Watch for file change, and run specified callback with path to changed files.

```js
function doSomething(filepath, type) {
  console.info(`File ${filepath} was just ${type}`);
}
const watcher = await watch(
  './path/to/files/*.jpg',
  doSomething,
  'my-watcher'
);

// To remove the watcher:
await unwatch('my-watch');
// or await unwatch(watcher);
// To remove all watchers:
await unwatchAll();
// To force wait until all watchers are executed
await waitForWatchers();
```

### `write(content, destination)`

Write content to a file on disk.

```js
await write('This is my content', './dist/content.txt');
```

### `writeJson(data, destination)`

Write data to a JSON file on disk. Keys will be ordered alphabetically, for
easier diffing of the file.

```js
const records = [
  { name: 'foo', value: 2 },
  { value: 3, name: 'bar' },
];
await writeJson(records, './records/records.json');
```

## Shell methods

These methods help abstracting some common CLI tasks

### `exit`

Stop the current process with specified `exitCode`. Similar to `process.exit`.

```js
exit(1);
```

### `consoleInfo`

Display an information message

```js
consoleInfo('Info');
// • Info
```

### `consoleWarn`

Display a warning message

```js
consoleWarn('Warning');
// ⚠ Warning
```

### `consoleError`

Display an error message

```js
consoleInfo('Error');
// ✘ Error
```

### `consoleSuccess`

Display an success message

```js
consoleSuccess('Success');
// ✔ Success
```

### `prompt(question)`

Interactively ask user a question

```js
const mood = await prompt('How do you feel?');
```

### `run(command)`

Run a shell command just like in the terminal, but also allows access to
`stdout`, `stderr` and exit `code`.

#### Options

| name     | default value | description                                                                                 |
| -------- | ------------- | ------------------------------------------------------------------------------------------- |
| `shell`  | `false`       | Set to `true` to enable shell-specific feature (like &&, >, etc)                            |
| `stdout` | `true`        | Set to false to silence stdout                                                              |
| `stderr` | `true`        | Set to false to silence stderr                                                              |
| `stdin`  | `false`       | Set to true to allow user to input keyboard keys. This sets `stdout` and `stderr` to `true` |

```javascript
const { stdout } = await run('echo foo'); // foo
const { stderr } = await run('>&2 echo bar', { shell: true }); // foo
try {
  await run('echo foo && exit 42');
} catch (err) {
  // err.code = 42
  // err.stdout = foo
}
```

### `spinner(max)`

Creates a spinner with optional max number of elements.

```js
const progress = spinner(10);

progress.tick('Doing task 1');
progress.success('All tasks done');
// or progress.failure('All tasks failed');
```

### `shell(command)`

_Deprecated. Use `run` instead, it if much more flexible_

Run the given command in a shell. Returns `stdout`, throws with `stderr` and
`exitCode`.

```js
try {
  const result = await shell('git checkout -b master');
  console.info('Created branch master');
} catch (err) {
  console.error(err.message);
  console.error(err.code);
}
```

### `sleep(delay)`

Wait for a specific number of milliseconds

```js
await sleep(100); // Wait for 100 ms
```

### `tmpDirectory()`

Returns a random temporary folder, optionally scoped.

```js
tmpDirectory(); // /tmp/{some-random-uuid}
tmpDirectory('firost/scope/'); // /tmp/firost/scope/{some-random-uuid}
```

### `which(command)`

Returns the path to an executable on the system. Returns `false` if none is
found.

```js
if (!(await which('convert'))) {
  console.info('You need to install ImageMagick');
}
```

## Utils

### `cache`

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

### `captureOutput`

Silence all output of the specified code, and return it instead

```js
const actual = await captureOutput(async () => {
  console.info("This will not get displayed");
  await run('echo Test');
  await run('./no-existing-script.sh');
});
// actual.stdout: ["This will not get displayed", "Test"]
// actual.stderr: ["Command does not exist"]
```

### `error`

Returns an `Error` with both a `.code` and a `.message`

```js
throw error('E_ERROR', 'This failed');
```

### `normalizeUrl`

Normalize a URL

```js
normalizeUrl('http://www.there.com/index.html?sort=asc&name=firost');
// http://www.there.com/?name=firost&sort=asc
```

### `pulse`

Shared event emitter to listen and emit events

```js
pulse.on('custom', data => {
  console.info(data);
});
pulse.emit('custom', 'Hello');
// Hello
```

### `firostImpot(id)`

Alternative to the default dynamic `import()`. Pass `forceReload: true` as an option to
force reloading the latest version on disk, bypassing the singleton cache.

```js
const module = await firostImport('./path/to/module.js');
const updatedModule = await firostImport('./path/to/module.js', {
  forceReload: true,
});
```

### `uuid()`

Returns a unique ID that could be used in URL of filepaths.

```js
console.info(uuid());
// V1StGXR8_Z5jdHi6B-myT
```
