import fs from 'fs-extra';

/**
 * Create directories recursively
 * @param {String} dirPath Directory path to create
 * @returns {Void}
 **/
const module = async function mkdirp(dirPath) {
  return await fs.mkdirp(dirPath);
};

export default module;