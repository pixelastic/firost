import callstack from './callstack.js';
/**
 * Return the full path to the file calling here();
 * @returns {string} Absolute filepath to the calling script
 **/
export default function () {
  return callstack()[1].filepath;
}
