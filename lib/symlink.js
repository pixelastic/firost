import path from 'node:path';
import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';
import { exists } from './exists.js';
import { isSymlink } from './isSymlink.js';
import { mkdirp } from './mkdirp.js';
import { remove } from './remove.js';

/**
 * Creates a symlink
 * It will overwrite existing files and create directory structure if needed,
 * and will allow creating broken symlinks
 * @param {string} filepath Path of the symlink
 * @param {string} target Path to the target
 **/
export async function symlink(filepath, target) {
  const cwd = callerDir();
  const absolutePath = absolute(filepath, { cwd });

  // Only convert target paths to absolute if they are not explicitly relative
  // In symlink, we want to keep the ability to link to a relative path
  const absoluteTarget = isRelativePath(target)
    ? target
    : absolute(target, { cwd });

  // If the file already exists, or is a broken symlink, we delete it first
  if ((await exists(absolutePath)) || (await isSymlink(absolutePath))) {
    await remove(absolutePath);
  }

  // fs.ensureSymlink from fs-extra does not allow creating broken symlinks, so
  // we cannot use it and have to do the process ourselves
  await mkdirp(path.dirname(absolutePath));
  await fs.symlink(absoluteTarget, absolutePath);
}

/**
 * Check if a path is a relative path (starts with ./ or ../)
 * @param {string} targetPath Path to check
 * @returns {boolean} True if the path is relative
 **/
function isRelativePath(targetPath) {
  return targetPath.startsWith('./') || targetPath.startsWith('../');
}
