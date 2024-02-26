import { _ } from 'golgoth';
import fs from 'fs-extra';
import absolute from './absolute.js';

/**
 * Read any file on disk
 * @param {string} userFilepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
export default async function read(userFilepath) {
  const filepath = absolute(userFilepath);
  const content = await fs.readFile(filepath);
  return _.trim(content.toString('utf8'));
}
