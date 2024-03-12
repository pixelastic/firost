import absolute from './absolute.js';
import cache from './cache.js';
import captureOutput from './captureOutput.js';
import consoleError from './consoleError.js';
import consoleInfo from './consoleInfo.js';
import consoleSuccess from './consoleSuccess.js';
import consoleWarn from './consoleWarn.js';
import copy from './copy.js';
import dirname from './dirname.js';
import download from './download.js';
import emptyDir from './emptyDir.js';
import env from './env.js';
import error from './error.js';
import exists from './exists.js';
import exit from './exit.js';
import gitRoot from './gitRoot.js';
import glob from './glob.js';
import isDirectory from './isDirectory.js';
import isFile from './isFile.js';
import isSymlink from './isSymlink.js';
import isUrl from './isUrl.js';
import mkdirp from './mkdirp.js';
import move from './move.js';
import newFile from './newFile/index.js';
import normalizeUrl from './normalizeUrl.js';
import packageRoot from './packageRoot.js';
import prompt from './prompt.js';
import pulse from './pulse.js';
import readJsonUrl from './readJsonUrl.js';
import readJson from './readJson.js';
import readUrl from './readUrl.js';
import read from './read.js';
import remove from './remove.js';
import run from './run.js';
import sleep from './sleep.js';
import spinner from './spinner.js';
import symlink from './symlink.js';
import tmpDirectory from './tmpDirectory.js';
import unwatchAll from './unwatchAll.js';
import unwatch from './unwatch.js';
import urlToFilepath from './urlToFilepath.js';
import uuid from './uuid.js';
import waitForWatchers from './waitForWatchers.js';
import watch from './watch/index.js';
import which from './which.js';
import writeJson from './writeJson.js';
import write from './write.js';
import _import from './import.js';

// Named exports (preferred way)
// Usage: import { absolute, which } from 'firost';
export { absolute as absolute };
export { cache as cache };
export { captureOutput as captureOutput };
export { consoleError as consoleError };
export { consoleInfo as consoleInfo };
export { consoleSuccess as consoleSuccess };
export { consoleWarn as consoleWarn };
export { copy as copy };
export { dirname as dirname };
export { download as download };
export { emptyDir as emptyDir };
export { env as env };
export { error as error };
export { error as firostError };
export { exists as exists };
export { exit as exit };
export { gitRoot as gitRoot };
export { glob as glob };
export { isDirectory as isDirectory };
export { isFile as isFile };
export { isSymlink as isSymlink };
export { isUrl as isUrl };
export { mkdirp as mkdirp };
export { move as move };
export { newFile as newFile };
export { normalizeUrl as normalizeUrl };
export { packageRoot as packageRoot };
export { prompt as prompt };
export { pulse as pulse };
export { readJsonUrl as readJsonUrl };
export { readJson as readJson };
export { readUrl as readUrl };
export { read as read };
export { remove as remove };
export { run as run };
export { sleep as sleep };
export { spinner as spinner };
export { symlink as symlink };
export { tmpDirectory as tmpDirectory };
export { unwatchAll as unwatchAll };
export { unwatch as unwatch };
export { urlToFilepath as urlToFilepath };
export { uuid as uuid };
export { waitForWatchers as waitForWatchers };
export { watch as watch };
export { which as which };
export { writeJson as writeJson };
export { write as write };
export { _import as import };
export { _import as firostImport };

// Default export (god object)
// Usage: import firost from 'firost';
export default {
  absolute,
  cache,
  captureOutput,
  consoleError,
  consoleInfo,
  consoleSuccess,
  consoleWarn,
  copy,
  dirname,
  download,
  emptyDir,
  env,
  error,
  exists,
  exit,
  firostError: error,
  firostImport: _import,
  gitRoot,
  glob,
  import: _import,
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
