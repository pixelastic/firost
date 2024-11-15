import callstack from './callstack.js';

/**
 * Return the full path to the parent of the file that called caller();
 *
 * Example:
 *   - ./my-project/my-file.js calls ./helper.js
 *   - ./my-project/helper.js calls caller() => ./my-project/my-file.js
 *
 * @returns {string} Absolute filepath to the parent of the calling script
 **/
export default function caller() {
  return callstack(2).filepath;
}
