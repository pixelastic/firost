import fs from 'fs-extra';

/**
 * Check if a path exists
 * @param {string} target Path to check
 * @returns {boolean} true if exists, false otherwise
 **/
const module = async function exists(target) {
  return await fs.pathExists(target);
};
export default module;
