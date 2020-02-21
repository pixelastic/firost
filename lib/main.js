const cache = require('./cache');
const consoleError = require('./consoleError');
const consoleInfo = require('./consoleInfo');
const consoleSuccess = require('./consoleSuccess');
const consoleWarn = require('./consoleWarn');
const copy = require('./copy');
const download = require('./download');
const emptyDir = require('./emptyDir');
const error = require('./error');
const exists = require('./exists');
const exit = require('./exit');
const glob = require('./glob');
const isDirectory = require('./isDirectory');
const isFile = require('./isFile');
const mkdirp = require('./mkdirp');
const move = require('./move');
const prompt = require('./prompt');
const pulse = require('./pulse');
const readJsonUrl = require('./readJsonUrl');
const readJson = require('./readJson');
const read = require('./read');
const remove = require('./remove');
const _require = require('./require');
const run = require('./run');
const shell = require('./shell');
const sleep = require('./sleep');
const spinner = require('./spinner');
const unwatchAll = require('./unwatchAll');
const unwatch = require('./unwatch');
const urlToFilepath = require('./urlToFilepath');
const uuid = require('./uuid');
const waitForWatchers = require('./waitForWatchers');
const watch = require('./watch');
const which = require('./which');
const writeJson = require('./writeJson');
const write = require('./write');

module.exports = {
  cache,
  consoleError,
  consoleInfo,
  consoleSuccess,
  consoleWarn,
  copy,
  download,
  emptyDir,
  error,
  exists,
  exit,
  exist: exists, // Alias to avoid common typo
  glob,
  isDirectory,
  isFile,
  mkdirp,
  move,
  prompt,
  pulse,
  readJsonUrl,
  readJson,
  read,
  remove,
  require: _require,
  run,
  shell,
  sleep,
  spinner,
  unwatchAll,
  unwatch,
  urlToFilepath,
  uuid,
  waitForWatchers,
  watch,
  which,
  writeJson,
  write,
};
