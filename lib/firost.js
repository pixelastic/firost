import cache from './cache';
import copy from './copy';
import download from './download';
import emptyDir from './emptyDir';
import error from './error';
import exists from './exists';
import glob from './glob';
import isDirectory from './isDirectory';
import isFile from './isFile';
import mkdirp from './mkdirp';
import move from './move';
import prompt from './prompt';
import pulse from './pulse';
import readJsonUrl from './readJsonUrl';
import readJson from './readJson';
import read from './read';
import remove from './remove';
import require from './require-esm';
import shell from './shell';
import sleep from './sleep';
import spinner from './spinner';
import unwatchAll from './unwatchAll';
import unwatch from './unwatch';
import urlToFilepath from './urlToFilepath';
import uuid from './uuid';
import waitForWatchers from './waitForWatchers';
import watch from './watch';
import which from './which';
import writeJson from './writeJson';
import write from './write';

export default {
  cache,
  copy,
  download,
  emptyDir,
  error,
  exists,
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
  require,
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
