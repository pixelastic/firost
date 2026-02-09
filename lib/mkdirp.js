import fs from 'fs-extra';
import { absolute } from './absolute.js';
import { callerDir } from './callerDir.js';

/**
 * Create directories recursively
 * @param {string} userWhere Directory path to create
 **/
export async function mkdirp(userWhere) {
  const where = absolute(userWhere, { cwd: callerDir() });
  await fs.mkdirp(where);
}
