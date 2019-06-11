import error from './error';
import fs from 'fs-extra';
import glob from './glob';
import isDirectory from './isDirectory';
import isFile from './isFile';
import isGlob from 'is-glob';
import path from 'path';
import { _, pMap } from 'golgoth';

/**
 * This is a High Order Component that will return a function that either copy
 * or move its arguments. The function itself has two private methods attached
 * to it, to handle globs and regular files. The .applyMethod contains the
 * method (fs.copy or fs.move) to finally call
 * @param {String} type Either copy or move
 * @returns {Function} The function to either copy or move
 **/
const module = function copyOrMove(type) {
  // Note that we call `method` and not `this` here because the applyToOne and
  // appluToGlob are added as properties of the function, so we can spy on them
  // in tests. There might be a better way here, but that's the best I could
  // come up with and respect the scoping
  const method = async function apply(source, destination) {
    // Handling glob
    if (isGlob(source)) {
      await method.applyToGlob(source, destination);
      return;
    }

    await method.applyToOne(source, destination);
  };
  method.applyToOne = _.bind(applyToOne, method);
  method.applyToGlob = _.bind(applyToGlob, method);

  if (type === 'copy') {
    method.applyMethod = fs.copy;
  }
  // Move does not overwrite content by default
  if (type === 'move') {
    method.applyMethod = function(source, destination) {
      return fs.move(source, destination, { overwrite: true });
    };
  }

  return method;
};

export default module;

/**
 * Private method used by copy() and move() for handling one file
 * @param {String} source Path to the source file
 * @param {String} userDestination Path to the destination
 * @returns {Void}
 **/
async function applyToOne(source, userDestination) {
  let destination = userDestination;
  const isDestinationFile = await isFile(destination);
  const isSourceDirectory = await isDirectory(source);

  // If the target is a directory, we put content in the directory
  if (await isDirectory(userDestination)) {
    const basename = path.basename(source);
    destination = path.join(userDestination, basename);
  }

  // Can't overwrite a file with a directory
  if (isSourceDirectory && isDestinationFile) {
    throw error(
      'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
      `Cannot overwrite non-directory '${destination}' with directory '${source}'.`
    );
  }

  await this.applyMethod(source, destination);
}

/**
 * Private method used by copy() and move() for handling several files
 * @param {String} globPattern Pattern matching files
 * @param {String} destination Path to the destination
 * @returns {Void}
 **/
async function applyToGlob(globPattern, destination) {
  const sources = await glob(globPattern);

  // No matches
  if (_.isEmpty(sources)) {
    throw error(
      'ERROR_GLOB_NO_MATCHES',
      `Glob pattern ${globPattern} does not match anything`
    );
  }

  // Only one match
  if (sources.length === 1) {
    await this.applyToOne(sources[0], destination);
    return;
  }

  // Several matches
  const isDestinationFile = await isFile(destination);

  // We cannot overwrite an existing file with several inputs
  if (isDestinationFile) {
    throw error(
      'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
      `You are trying to overwrite ${destination} with several different files`
    );
  }

  // Applying each matching element to destination
  await pMap(
    sources,
    async source => {
      const fullDestination = path.join(destination, path.basename(source));
      await this.applyToOne(source, fullDestination);
    },
    { concurrency: 10 }
  );
}