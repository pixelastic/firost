import path from 'node:path';
import fs from 'fs-extra';
import { mkdirp } from './mkdirp.js';
import { isSymlink } from './isSymlink.js';
import { exists } from './exists.js';
import { remove } from './remove.js';
import { absolute } from './absolute.js';

/**
 * Creates a symlink
 * It will overwrite existing files and create directory structure if needed,
 * and will allow creating broken symlinks
 * @param {string} filepath Path of the symlink
 * @param {string} target Path to the target
 **/
export async function symlink(filepath, target) {
  const absolutePath = absolute(filepath);

  // If the file already exists, or is a broken symlink, we delete it first
  if ((await exists(absolutePath)) || (await isSymlink(absolutePath))) {
    await remove(absolutePath);
  }

  // fs.ensureSymlink from fs-extra does not allow creating broken symlinks, so
  // we cannot use it and have to do the process ourselves
  await mkdirp(path.dirname(absolutePath));
  await fs.symlink(target, absolutePath);
}
