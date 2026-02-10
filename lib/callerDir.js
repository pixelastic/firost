import path from 'node:path';
import { callstack } from './callstack.js';

/**
 * Return the directory of the parent of the file that called callerDir();
 *
 * Example:
 *   - ./my-project/my-file.js calls ./node_modules/module/helper.js
 *   - ./node_modules/module/helper.js calls callerDir() => ./my-project
 *
 * @returns {string} Absolute directory path of the parent of the calling script
 **/
export function callerDir() {
  return path.dirname(callstack(2).filepath);
}
