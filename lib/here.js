import { callstack } from './callstack.js';
/**
 * Return the full path to the file calling here();
 *
 * Example:
 *   - ./my-project/my-file.js calls here() => /path/to/my-project/my-file.js
 *
 * @returns {string} Absolute filepath to the calling script
 **/
export function here() {
  return callstack(1).filepath;
}
