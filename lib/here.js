import { _ } from 'golgoth';
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
  // We remove any ?cacheBusting= that might have been added if the file is
  // imported by firostImport
  return _.chain(callstack(1).filepath).split('?').first().value();
}
