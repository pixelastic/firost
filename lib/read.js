import { _ } from 'golgoth';
import fs from 'fs-extra';

/**
 * Read any file on disk
 * @param {String} filepath Filepath of the file to read
 * @returns {String} Content of the file read
 **/
const module = async function read(filepath) {
  const content = await fs.readFile(filepath);
  return _.trim(content.toString('utf8'));
};

export default module;
