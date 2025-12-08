import { _ } from 'golgoth';
import { absolute } from './absolute.js';
/**
 * Transform one or several filepaths into an array of absolute filepaths.
 * This method does not expand globs or check for file existence.
 * @param {string|Array} userInput Single filepath or array of filepaths
 * @returns {Array} Array of absolute filepaths
 **/
export function resolve(userInput) {
  // Note: We need to build the output in steps, and not use _.chain().map() as
  // calling absolute() on relative paths can fail in a .map() because the
  // userlandCaller can be empty.
  // Better to build it in steps
  const input = _.isArray(userInput) ? userInput : [userInput];
  const output = _.map(input, (path) => {
    return absolute(path);
  });
  return output;
}
