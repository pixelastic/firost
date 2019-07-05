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
import readJsonUrl from './readJsonUrl';
import readJson from './readJson';
import read from './read';
import remove from './remove';
import shell from './shell';
import urlToFilepath from './urlToFilepath';
import watch from './watch';
import unwatch from './unwatch';
import unwatchAll from './unwatchAll';
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
  readJsonUrl,
  readJson,
  read,
  remove,
  shell,
  unwatchAll,
  unwatch,
  urlToFilepath,
  watch,
  writeJson,
  write,
};
