const error = require('./error');
const glob = require('./glob');
const isDirectory = require('./isDirectory');
const isFile = require('./isFile');
const isSymlink = require('./isSymlink');
const exists = require('./exists');
const isGlob = require('is-glob');
const path = require('path');
const _ = require('golgoth/lodash');
const pMap = require('golgoth/pMap');
const absolute = require('./absolute');
const fs = require('fs-extra');

module.exports = {
  async getMap(userSource, userDestination, options = {}) {
    let sources = await this.normalizeSources(userSource, options);

    // A few easier-to-read checks
    const destinationIsFile = await isFile(userDestination);
    const destinationIsDirectory = await isDirectory(userDestination);
    const destinationIsSymlink = await isSymlink(userDestination);
    const destinationExists = await exists(userDestination);
    const severalSourceFiles = sources.length > 1;

    // We cannot overwrite an existing file with several inputs
    if (severalSourceFiles && destinationIsFile) {
      throw error(
        'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        `You are trying to overwrite ${userDestination} with several different files`
      );
    }

    const result = [];
    await pMap(sources, async (source) => {
      let destination = userDestination;
      const sourceIsDirectory = await isDirectory(source);
      const sourceIsSymlink = await isSymlink(source);

      // Can't move a directory on top of a file
      if (sourceIsDirectory && destinationIsFile) {
        throw error(
          'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
          `Cannot overwrite file '${destination}' with directory '${source}'.`
        );
      }

      // If the target is a directory, we include the full path so the file is
      // copied/moved inside the directory
      // When dealing with several inputs, the destination is always
      // a directory, even if it does not yet exist, so we also expand the path
      // so the directories are created
      if (destinationIsDirectory || severalSourceFiles) {
        destination = path.join(destination, path.basename(source));
      }

      result.push({
        destinationExists,
        destinationIsSymlink,
        destination,
        sourceIsSymlink,
        source,
      });
    });

    return result;
  },

  async normalizeSources(userSource, userOptions = {}) {
    const options = {
      resolveSymlinks: false,
      ...userOptions,
    };
    let sources = userSource;
    // Source given as a glob, we make it a real list of files
    if (isGlob(userSource)) {
      sources = await glob(userSource);
    }

    sources = _.castArray(sources);

    // No matches
    if (_.isEmpty(sources)) {
      throw error(
        'ERROR_GLOB_NO_MATCHES',
        `Glob pattern ${sources} does not match anything`
      );
    }

    sources = _.map(sources, absolute);

    // Resolve symlinks if required (only for copy)
    if (options.resolveSymlinks) {
      sources = await pMap(sources, async (filepath) => {
        return fs.realpath(filepath);
      });
    }

    return sources;
  },
};
