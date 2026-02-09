import { _ } from 'golgoth';
import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';

/**
 * Read any file on disk
 * @param {string} userFilepath Filepath of the file to read
 * @returns {string} Content of the file read
 **/
export async function read(userFilepath) {
  const filepath = absolute(userFilepath, { cwd: callerDir() });
  const content = await fs.readFile(filepath);
  return _.trim(content.toString('utf8'));
}
