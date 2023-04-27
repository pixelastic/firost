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
const env = require('./env');
const error = require('./error');
const exists = require('./exists');
const exit = require('./exit');
const gitRoot = require('./gitRoot');
const glob = require('./glob');
const isDirectory = require('./isDirectory');
const isFile = require('./isFile');
const isSymlink = require('./isSymlink');
const isUrl = require('./isUrl');
const mkdirp = require('./mkdirp');
const move = require('./move');
const newFile = require('./newFile');
const normalizeUrl = require('./normalizeUrl');
const packageRoot = require('./packageRoot');
const prompt = require('./prompt');
const pulse = require('./pulse');
const readJsonUrl = require('./readJsonUrl');
const readJson = require('./readJson');
const readUrl = require('./readUrl');
const read = require('./read');
const remove = require('./remove');
const run = require('./run');
const sleep = require('./sleep');
const spinner = require('./spinner');
const symlink = require('./symlink');
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
  ensureDir: mkdirp,
  env,
  error,
  exists,
  exist: exists, // Alias to avoid common typo
  exit,
  gitRoot,
  glob,
  isDirectory,
  isFile,
  isSymlink,
  isUrl,
  mkdirp,
  move,
  newFile,
  normalizeUrl,
  packageRoot,
  prompt,
  pulse,
  readJsonUrl,
  readJson,
  readUrl,
  read,
  remove,
  require: _require,
  run,
  sleep,
  spinner,
  symlink,
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
