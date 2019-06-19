import fs from 'fs-extra';

/**
 * Create directories recursively
 * @param {string} dirPath Directory path to create
 * @returns {void}
 **/
const module = async function mkdirp(dirPath) {
  return await fs.mkdirp(dirPath);
};

export default module;
