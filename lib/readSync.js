import { _ } from 'golgoth';
import fs from 'fs-extra';
import absolute from './absolute.js';

/**
 * Read any file on disk, synchronously
 * @param {string} userFilepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
export default function read(userFilepath) {
  const filepath = absolute(userFilepath);
  const content = fs.readFileSync(filepath);
  return _.trim(content.toString('utf8'));
}