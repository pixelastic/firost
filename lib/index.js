import copy from './copy';
import download from './download';
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
import writeJson from './writeJson';
import write from './write';

export default {
  copy,
  download,
  error,
  exists,
  exist: exists, // Alias to avoid common typo
  glob,
  isDirectory,
  isFile,
  mkdirp,
  move,
  read,
  readJson,
  readJsonUrl,
  remove,
  shell,
  urlToFilepath,
  watch,
  write,
  writeJson,
};
