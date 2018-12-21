import fs from 'fs-extra';

/**
 * Check if a path exists
 * @param {String} target Path to check
 * @returns {Boolean} true if exists, false otherwise
 **/
const module = async function exists(target) {
  return await fs.pathExists(target);
};
export default module;
