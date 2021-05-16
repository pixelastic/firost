const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('./mkdirp');
const isSymlink = require('./isSymlink');
const exist = require('./exist');
const remove = require('./remove');
const absolute = require('./absolute');

/**
 * Creates a symlink
 * It will overwrite existing files and create directory structure if needed,
 * and will allow creating broken symlinks
 * @param {string} filepath Path of the symlink
 * @param {string} target Path to the target
 **/
module.exports = async function symlink(filepath, target) {
  const absolutePath = absolute(filepath);

  // If the file already exists, or is a broken symlink, we delete it first
  if ((await exist(absolutePath)) || (await isSymlink(absolutePath))) {
    await remove(absolutePath);
  }

  // fs.ensureSymlink from fs-extra does not allow creating broken symlinks, so
  // we cannot use it and have to do the process ourselves
  await mkdirp(path.dirname(absolutePath));
  await fs.symlink(target, absolutePath);
};
