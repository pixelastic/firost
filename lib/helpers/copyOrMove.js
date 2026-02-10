import path from 'node:path';
import { _, pMap } from 'golgoth';
import fs from 'fs-extra';
import isGlob from 'is-glob';
import { absolute } from '../absolute.js';
import { exists } from '../exists.js';
import { firostError } from '../firostError.js';
import { glob } from '../glob.js';
import { isDirectory } from '../isDirectory.js';
import { isFile } from '../isFile.js';
import { isSymlink } from '../isSymlink.js';

/**
 * Returns an object holding metadata about the file to copy/move.
 * Contains elements like formatted source and destination path, if destination
 * exists, if any is a symlink
 * @param {string} userSource Path to the source file
 * @param {string} userDestination Path to the destination file
 * @param {object} options Options to change the behavior
 * @returns {object} Object of metadata
 */
export async function getMap(userSource, userDestination, options = {}) {
  const cwd = options.cwd;
  if (!options.cwd) {
    throw firostError(
      'FIROST_COPY_OR_MOVE_MISSING_CWD',
      'This is an internal error. You need to pass a .cwd to copyOrMove.getMap();',
    );
  }

  const destination = absolute(userDestination, { cwd });
  const sources = await normalizeSources(userSource, options);

  // A few easier-to-read checks
  const destinationIsFile = await isFile(destination);
  const destinationIsDirectory = await isDirectory(destination);
  const destinationIsSymlink = await isSymlink(destination);
  const destinationExists = await exists(destination);
  const severalSourceFiles = sources.length > 1;

  // We cannot overwrite an existing file with several inputs
  if (severalSourceFiles && destinationIsFile) {
    throw firostError(
      'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
      `You are trying to overwrite ${userDestination} with several different files`,
    );
  }

  const result = [];
  await pMap(sources, async (source) => {
    let finalDestination = destination;
    const sourceIsDirectory = await isDirectory(source);
    const sourceIsSymlink = await isSymlink(source);

    // Can't move a directory on top of a file
    if (sourceIsDirectory && destinationIsFile) {
      throw firostError(
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
        `Cannot overwrite file '${destination}' with directory '${source}'.`,
      );
    }

    // If the target is a directory, we include the full path so the file is
    // copied/moved inside the directory
    // When dealing with several inputs, the destination is always
    // a directory, even if it does not yet exist, so we also expand the path
    // so the directories are created
    if (destinationIsDirectory || severalSourceFiles) {
      finalDestination = path.join(destination, path.basename(source));
    }

    result.push({
      destinationExists,
      destinationIsSymlink,
      destination: finalDestination,
      sourceIsSymlink,
      source,
    });
  });

  return result;
}

/**
 * Normalize sources to follow globs or symlinks
 * @param {string} userSource Source path
 * @param {object} userOptions Options to change the behavior
 * @returns {Array} Array of sources
 */
export async function normalizeSources(userSource, userOptions = {}) {
  const options = {
    resolveSymlinks: false,
    ...userOptions,
  };
  const { cwd } = options;
  let sources = userSource;
  // Source given as a glob, we make it a real list of files
  if (isGlob(userSource)) {
    sources = await glob(absolute(userSource, { cwd }));
  }
  sources = _.castArray(sources);

  // No matches
  if (_.isEmpty(sources)) {
    throw firostError(
      'FIROST_COPY_OR_MOVE_GLOB_NO_MATCHES',
      `Glob pattern ${sources} does not match anything`,
    );
  }

  // Convert sources to absolute paths
  sources = _.map(sources, (source) => {
    return absolute(source, { cwd });
  });

  // Resolve symlinks if required (only for copy)
  if (options.resolveSymlinks) {
    sources = await pMap(sources, async (filepath) => {
      return fs.realpath(filepath);
    });
  }

  return sources;
}
