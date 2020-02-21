const error = require('./error');
const glob = require('./glob');
const isDirectory = require('./isDirectory');
const isFile = require('./isFile');
const isGlob = require('is-glob');
const path = require('path');
const _ = require('golgoth/lib/_');
const pMap = require('golgoth/lib/pMap');

module.exports = {
  async getMap(userSource, userDestination) {
    let sources = await this.normalizeSources(userSource);

    // A few easier-to-read checks
    const isDestinationFile = await isFile(userDestination);
    const isDestinationDirectory = await isDirectory(userDestination);
    const severalSourceFiles = sources.length > 1;

    // We cannot overwrite an existing file with several inputs
    if (severalSourceFiles && isDestinationFile) {
      throw error(
        'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        `You are trying to overwrite ${userDestination} with several different files`
      );
    }

    const result = [];
    await pMap(sources, async source => {
      let destination = userDestination;

      // Can't move a directory on top of a file
      const isSourceDirectory = await isDirectory(source);
      if (isSourceDirectory && isDestinationFile) {
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
      if (isDestinationDirectory || severalSourceFiles) {
        destination = path.join(destination, path.basename(source));
      }

      result.push({ source, destination });
    });

    return result;
  },

  async normalizeSources(userSource) {
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

    return sources;
  },
};
