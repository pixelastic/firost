import path from 'node:path';
import { _ } from 'golgoth';
import { commonParentDirectory } from '../../commonParentDirectory.js';
import { exists } from '../../exists.js';

/**
 * Find the only common path ancestor from a list of filepaths
 * @param {Array} filepaths List of absolute filepaths and/or glob patterns
 * @returns {string} Single unique common ancestor directory of all inputs
 **/
export async function getCommonParentDirectory(filepaths) {
  const cleanedFilepaths = _.map(filepaths, (filepath) => {
    return _.trimStart(filepath, '!');
  });

  const theoreticalParent = commonParentDirectory(cleanedFilepaths);
  const existingParent = await getExistingParent(theoreticalParent);

  return existingParent;
}

/**
 * Returns the deepest directory that actually exist on disk from a given
 * filepath
 * @param {string} filepath Filepath directory to test
 * @returns {string} Filepath to an existing directory
 */
async function getExistingParent(filepath) {
  if (await exists(filepath)) {
    return filepath;
  }
  return await getExistingParent(path.dirname(filepath));
}
