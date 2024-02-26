import fs from 'fs-extra';
import absolute from './absolute.js';

/**
 * Create directories recursively
 * @param {string} userWhere Directory path to create
 **/
export default async function mkdirp(userWhere) {
  const where = absolute(userWhere);
  await fs.mkdirp(where);
}