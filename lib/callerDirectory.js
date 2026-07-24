import path from 'node:path';
import { callstack } from './callstack.js';

/**
 * Return the directory of the parent of the file that called callerDirectory();
 *
 * Example:
 *   - ./my-project/my-file.js calls ./node_modules/module/helper.js
 *   - ./node_modules/module/helper.js calls callerDirectory() => ./my-project
 *
 * @returns {string} Absolute directory path of the parent of the calling script
 **/
export function callerDirectory() {
  return path.dirname(callstack(2).filepath);
}
