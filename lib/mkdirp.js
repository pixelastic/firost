import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDirectory } from './callerDirectory.js';

/**
 * Create directories recursively
 * @param {string} userWhere Directory path to create
 **/
export async function mkdirp(userWhere) {
  const where = absolute(userWhere, { cwd: callerDirectory() });
  await fs.mkdirp(where);
}
