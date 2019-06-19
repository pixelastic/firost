import fs from 'fs-extra';

/**
 * Create directories recursively
 * @param {string} dirPath Directory path to create
 **/
const module = async function mkdirp(dirPath) {
  await fs.mkdirp(dirPath);
};

export default module;
