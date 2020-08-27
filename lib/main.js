const absolute = require('./absolute');
const cache = require('./cache');
const captureOutput = require('./captureOutput');
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
const gitRoot = require('./gitRoot');
const glob = require('./glob');
const isDirectory = require('./isDirectory');
const isFile = require('./isFile');
const mkdirp = require('./mkdirp');
const move = require('./move');
const normalizeUrl = require('./normalizeUrl');
const packageRoot = require('./packageRoot');
const prompt = require('./prompt');
const pulse = require('./pulse');
const readJsonUrl = require('./readJsonUrl');
const readJson = require('./readJson');
const read = require('./read');
const remove = require('./remove');
const run = require('./run');
const sleep = require('./sleep');
const spinner = require('./spinner');
const tmpDirectory = require('./tmpDirectory');
const unwatchAll = require('./unwatchAll');
const unwatch = require('./unwatch');
const urlToFilepath = require('./urlToFilepath');
const uuid = require('./uuid');
const waitForWatchers = require('./waitForWatchers');
const watch = require('./watch');
const which = require('./which');
const writeJson = require('./writeJson');
const write = require('./write');
const _require = require('./require');

module.exports = {
  absolute,
  cache,
  captureOutput,
  consoleError,
  consoleInfo,
  consoleSuccess,
  consoleWarn,
  copy,
  download,
  emptyDir,
  error,
  exists,
  exist: exists, // Alias to avoid common typo
  exit,
  gitRoot,
  glob,
  isDirectory,
  isFile,
  mkdirp,
  move,
  normalizeUrl,
  packageRoot,
  prompt,
  pulse,
  readJsonUrl,
  readJson,
  read,
  remove,
  require: _require,
  run,
  sleep,
  spinner,
  tmpDirectory,
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
